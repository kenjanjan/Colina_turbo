import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { UserNotification } from 'src/userNotifications/entities/user-notification.entity';
import { Users } from 'src/users/entities/users.entity';
@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(UserNotification)
    private readonly userNotificationRepository: Repository<UserNotification>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const { appointmentId, medicationLogId } = createNotificationDto;

    try {
      if (appointmentId) {
        const existingAppointment = await this.notificationRepository.findOne({
          where: { appointmentId },
        });
        if (existingAppointment) {
          throw new BadRequestException(
            'Notification for this appointment already exists',
          );
        }
      }

      if (medicationLogId) {
        const existingMedicationLog = await this.notificationRepository.findOne(
          { where: { medicationLogId } },
        );
        if (existingMedicationLog) {
          throw new BadRequestException(
            'Notification for this medication log already exists',
          );
        }
      }

      const notification = this.notificationRepository.create(
        createNotificationDto,
      );
      return this.notificationRepository.save(notification);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getAllNotifications(
    term: string,
    notificationType: string = 'All',
    page: number = 1,
    perPage: number = 4,
    userUuid: string,
  ): Promise<{
    data: Notification[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
  }> {
    const user = await this.usersRepository.findOne({
      select: ['id'],
      where: { uuid: userUuid },
    });
    const skip = (page - 1) * perPage;
    const searchTerm = `%${term}%`;

    const medication = [
      'medicationLog.uuid',
      'notification.uuid',
      'notification.patientName',
      'notification.patientId',
      'notification.notificationType',
      'notification.medicationName',
      'notification.medicationDosage',
      'notification.date',
      'notification.time',
      'notification.status',
      'notification.details',
    ];

    const appointment = [
      'appointment.uuid',
      'notification.uuid',
      'notification.patientName',
      'notification.patientId',
      'notification.appointmentType',
      'notification.date',
      'notification.time',
      'notification.status',
      'notification.details',
    ];

    const queryBuilder = this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoin('notification.appointment', 'appointment')
      .leftJoin('notification.medicationLog', 'medicationLog')
      .leftJoinAndSelect(
        'notification.userNotifications',
        'userNotification',
        'userNotification.userId = :userId',
        { userId: user.id },
      )
      .select(
        notificationType === 'Medication'
          ? medication
          : notificationType === 'Appointment'
            ? appointment
            : notificationType === 'All'
              ? [
                  'notification.uuid',
                  'notification.patientName',
                  'notification.patientId',
                  'notification.appointmentType',
                  'notification.notificationType',
                  'notification.medicationName',
                  'notification.medicationDosage',
                  'notification.date',
                  'notification.time',
                  'notification.status',
                  'notification.details',
                ]
              : [],
      )
      .addSelect('userNotification.is_read')
      .where('notification.status = :status', { status: 'Missed' });

    // Conditionally add `andWhere` clause for notificationType
    if (notificationType !== 'All') {
      queryBuilder.andWhere(
        'notification.notificationType = :notificationType',
        { notificationType },
      );
    }

    // Conditionally add search term
    if (term !== '') {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('notification.uuid ILIKE :searchTerm', { searchTerm })
            .orWhere('notification.patientName ILIKE :searchTerm')
            .orWhere('notification.patientId ILIKE :searchTerm');
        }),
      );
    }

    queryBuilder
      .orderBy('notification.date', 'DESC')
      .orderBy('userNotification.is_read', 'DESC') 
      .addOrderBy('notification.time', 'DESC')
      .offset(skip)
      .limit(perPage);

    const [notifications, totalNotifications] = await Promise.all([
      queryBuilder.getMany(),
      queryBuilder.getCount(),
    ]);

    const totalPages = Math.ceil(totalNotifications / perPage);

    return {
      data: notifications,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalNotifications,
    };
  }
}
