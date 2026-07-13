import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Snap } from 'midtrans-client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  private readonly snap: Snap;

  constructor(private readonly prisma: PrismaService) {
    this.snap = new Snap({
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
      clientKey: process.env.MIDTRANS_CLIENT_KEY!,
    });
  }

  async create(dto: CreateTransactionDto) {
    const product = await this.prisma.product.findUnique({ where: { id: dto.produkId } });

    if (!product) {
      throw new NotFoundException(`Produk dengan id ${dto.produkId} tidak ditemukan`);
    }

    if (product.stok < 1) {
      throw new BadRequestException('Stok produk habis');
    }

    const order = await this.prisma.order.create({
      data: {
        namaPembeli: dto.namaPembeli,
        email: dto.email,
        noHp: dto.noHp,
        produkId: product.id,
        total: product.harga,
        statusPembayaran: 'pending',
      },
    });

    const orderIdMidtrans = `ORDER-${order.id}-${Date.now()}`;

    const transaction = await this.snap.createTransaction({
      transaction_details: {
        order_id: orderIdMidtrans,
        gross_amount: order.total,
      },
      customer_details: {
        first_name: dto.namaPembeli,
        email: dto.email,
        phone: dto.noHp,
      },
      item_details: [
        {
          id: String(product.id),
          name: product.nama,
          price: product.harga,
          quantity: 1,
        },
      ],
    } as Parameters<Snap['createTransaction']>[0]);

    await this.prisma.order.update({
      where: { id: order.id },
      data: { orderIdMidtrans },
    });

    return {
      orderId: order.id,
      orderIdMidtrans,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    };
  }
}
