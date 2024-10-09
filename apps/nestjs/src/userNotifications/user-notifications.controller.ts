import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { CreateUserNotificationDto } from './dto/create-user-notification.dto';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto';
import { UserNotificationsService } from './user-notifications.service';
import { UserNotification } from './entities/user-notification.entity';
import { Notification } from 'src/notifications/entities/notification.entity';

@Controller('user-notifications')
export class UserNotificationsController {
  constructor(
    private readonly userNotificationsService: UserNotificationsService,
  ) {}

  @Post('mark-read')
  async createUserNotifications(
    @Body() body: { userId: string; notificationId: string },
  ) {
    const { userId, notificationId } = body;
    return this.userNotificationsService.createUserNotification(
      userId,
      notificationId,
    );
  }

  @Get('missed/:id')
  async getMissedNotifications(
    @Param('id') patientId: string,
  ): Promise<Notification[]> {
    return this.userNotificationsService.getMissedNotifications(patientId);
  }

  @Get()
  findAll() {
    return this.userNotificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userNotificationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserNotificationDto: UpdateUserNotificationDto,
  ) {
    return this.userNotificationsService.update(+id, updateUserNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userNotificationsService.remove(+id);
  }
}
