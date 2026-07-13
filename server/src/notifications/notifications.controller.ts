import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import type { MidtransNotificationPayload } from './notifications.service';

@Controller('notification')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  @HttpCode(200)
  handle(@Body() payload: MidtransNotificationPayload) {
    return this.notificationsService.handle(payload);
  }
}
