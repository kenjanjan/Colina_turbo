import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { UserNotification } from 'src/userNotifications/entities/user-notification.entity';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';
import { Users } from 'src/users/entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, UserNotification, Appointments, MedicationLogs,Users])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
