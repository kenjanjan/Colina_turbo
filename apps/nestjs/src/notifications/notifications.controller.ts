import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from './entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('all-notifications')
  async getAllNotifications(
    @Body()
    body: {
      term: string;
      notificationType: string;
      page: number;
      perPage: number;
      userUuid: string;
    },
  ) {
    const { term = '', notificationType, page, perPage, userUuid } = body;
    return this.notificationsService.getAllNotifications(
      term,
      notificationType,
      page,
      perPage,
      userUuid,
    );
  }
}
