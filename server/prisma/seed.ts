import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function main() {
  await prisma.product.createMany({
    data: [
      {
        nama: 'Kaos Polos Premium',
        harga: 120000,
        gambar: 'https://picsum.photos/seed/kaos-polos/400/400',
        stok: 25,
      },
      {
        nama: 'Sepatu Sneakers Casual',
        harga: 350000,
        gambar: 'https://picsum.photos/seed/sneakers/400/400',
        stok: 10,
      },
      {
        nama: 'Tote Bag Canvas',
        harga: 85000,
        gambar: 'https://picsum.photos/seed/tote-bag/400/400',
        stok: 40,
      },
    ],
  });
}

main()
  .then(async () => {
    console.log('Seed selesai.');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
