import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [PrismaModule, ProductsModule, TransactionsModule, NotificationsModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
