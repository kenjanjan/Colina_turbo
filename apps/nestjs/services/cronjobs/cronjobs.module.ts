import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
import { MedicationLogsService } from 'src/medicationLogs/medicationLogs.service';
import { PrescriptionFilesService } from 'src/prescriptionsFiles/prescriptionsFiles.service';
import { PrescriptionsFiles } from 'src/prescriptionsFiles/entities/prescriptionsFiles.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { NotificationsService } from 'src/notifications/notifications.service';
import { UserNotification } from 'src/userNotifications/entities/user-notification.entity';
import { Users } from 'src/users/entities/users.entity';
import { UserNotificationGateway } from './user-notification-gateway';
import { AppointmentFilesService } from 'src/appointmentsFiles/appointmentsFiles.service';
import { AppointmentsFiles } from 'src/appointmentsFiles/entities/appointmentsFiles.entity';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersPrescriptions } from 'src/orders_prescriptions/entities/orders_prescription.entity';
import { OrdersPrescriptionsService } from 'src/orders_prescriptions/orders_prescriptions.service';
import { Orders } from 'src/orders/entities/order.entity';
import { OrdersLaboratory } from 'src/orders_laboratory/entities/orders_laboratory.entity';
import { OrdersLaboratoryService } from 'src/orders_laboratory/orders_laboratory.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointments, Patients, Prescriptions,MedicationLogs,PrescriptionsFiles, Notification, AppointmentsFiles ,UserNotification, Users, Appointments, AppointmentsFiles, Orders,OrdersPrescriptions, OrdersLaboratory])],

  providers: [CronjobsService, AppointmentsService, AppointmentFilesService, UserNotificationGateway, PrescriptionsService,MedicationLogsService,  PrescriptionFilesService, IdService, NotificationsService, OrdersService,OrdersPrescriptionsService,AppointmentFilesService,AppointmentsService, OrdersLaboratoryService] // Include AppointmentsService here
})

export class CronjobsModule {

}
