import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

export interface MidtransNotificationPayload {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async handle(payload: MidtransNotificationPayload) {
    this.verifySignature(payload);

    const order = await this.prisma.order.findUnique({
      where: { orderIdMidtrans: payload.order_id },
    });

    if (!order) {
      this.logger.warn(`Notifikasi diterima untuk order_id tak dikenal: ${payload.order_id}`);
      return { message: 'Order tidak ditemukan' };
    }

    const statusPembayaran = this.mapStatus(payload.transaction_status, payload.fraud_status);

    if (!statusPembayaran) {
      this.logger.log(
        `Status Midtrans "${payload.transaction_status}" untuk order ${payload.order_id} tidak diproses`,
      );
      return { message: 'Status diterima tapi tidak diproses' };
    }

    await this.prisma.order.update({
      where: { id: order.id },
      data: { statusPembayaran },
    });

    this.logger.log(`Order ${order.id} (${payload.order_id}) -> ${statusPembayaran}`);

    return { message: 'Notifikasi berhasil diproses' };
  }

  private verifySignature(payload: MidtransNotificationPayload) {
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const raw = `${payload.order_id}${payload.status_code}${payload.gross_amount}${serverKey}`;
    const expectedSignature = createHash('sha512').update(raw).digest('hex');

    if (expectedSignature !== payload.signature_key) {
      throw new UnauthorizedException('Signature notifikasi tidak valid');
    }
  }

  private mapStatus(
    transactionStatus: string,
    fraudStatus?: string,
  ): 'pending' | 'success' | 'failed' | 'expired' | null {
    switch (transactionStatus) {
      case 'capture':
        return fraudStatus === 'accept' ? 'success' : 'failed';
      case 'settlement':
        return 'success';
      case 'pending':
        return 'pending';
      case 'deny':
      case 'cancel':
        return 'failed';
      case 'expire':
        return 'expired';
      default:
        return null;
    }
  }
}
