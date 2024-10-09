import { Module } from '@nestjs/common';
import { UserNotificationsController } from './user-notifications.controller';
import { UserNotificationsService } from './user-notifications.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserNotification } from './entities/user-notification.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { Users } from 'src/users/entities/users.entity';
import { IdService } from 'services/uuid/id.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserNotification, Notification, Users])],
  controllers: [UserNotificationsController],
  providers: [UserNotificationsService, IdService],
})
export class UserNotificationsModule {}
