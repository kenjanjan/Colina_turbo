import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserNotificationDto } from './dto/create-user-notification.dto';
import { UpdateUserNotificationDto } from './dto/update-user-notification.dto';
import { IdService } from 'services/uuid/id.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserNotification } from './entities/user-notification.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
@Injectable()
export class UserNotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(UserNotification)
    private readonly userNotificationRepository: Repository<UserNotification>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly idService: IdService,
  ) {}

  async createUserNotification(
    userId: string,
    notificationId: string,
  ): Promise<UserNotification> {
    console.log(userId, notificationId);

    const user = await this.usersRepository.findOne({
      select: ['id'],
      where: { uuid: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notification = await this.notificationRepository.findOne({
      select: ['id'],
      where: { uuid: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    const existingUserNotification =
      await this.userNotificationRepository.findOne({
        where: {
          userId: user.id,
          notificationId: notification.id,
        },
      });

    if (existingUserNotification) {
      throw new ConflictException('User notification already exists');
    }

    const uuidPrefix = 'USN-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);

    const newUserNotification = new UserNotification();
    newUserNotification.uuid = uuid;
    newUserNotification.userId = user.id;
    newUserNotification.notificationId = notification.id;
    newUserNotification.is_read = true;

    return this.userNotificationRepository.save(newUserNotification);
  }

  async getMissedNotifications(userUuid: string): Promise<Notification[]> {
    // Fetch the user based on userUuid
    const user = await this.usersRepository.findOne({
      select: ['id'],
      where: { uuid: userUuid },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Fetch missed notifications with user notification status
    const missedNotifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect(
        'notification.userNotifications',
        'userNotification',
        'userNotification.userId = :userId',
        { userId: user.id },
      )
      .leftJoin('notification.appointment', 'appointment')
      .leftJoin('notification.medicationLog', 'medicationLog')
      .where('notification.status = :status', { status: 'Missed' })
      .addSelect('appointment.uuid')
      .addSelect('medicationLog.uuid')
      .addSelect('userNotification.is_read') // Include is_read field
      .addSelect('notification.patientId') // Include userNotification id
      .orderBy('userNotification.is_read', 'DESC') // Order by is_read status
      .addOrderBy('notification.date', 'DESC') // Then order by createdAt
      .addOrderBy('notification.time', 'DESC') // Then order by createdAt
      .limit(25)
      .getMany();

    // Map to include is_read in the result
    return missedNotifications.map((notification) => {
      const userNotification = notification.userNotifications.find(
        (un) => un.userId === user.id,
      );
      const result = {
        ...notification,
        isRead: userNotification ? userNotification.is_read : false,
      };
  
      // Delete the id and deletedAt fields
      delete result.id;
      delete result.deletedAt;
      delete result.appointmentId;
      delete result.updatedAt;
      delete result.medicationLogId;
      delete result.userNotifications[0]?.id
      delete result.userNotifications[0]?.userId
      delete result.userNotifications[0]?.notificationId
      delete result.userNotifications[0]?.updatedAt
      delete result.userNotifications[0]?.createdAt
      delete result.userNotifications[0]?.deletedAt
  
      return result;
    });
  }

  findAll() {
    return `This action returns all notifications`;
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
  }

  update(id: number, updateUserNotificationDto: UpdateUserNotificationDto) {
    return `This action updates a #${id} notification`;
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
