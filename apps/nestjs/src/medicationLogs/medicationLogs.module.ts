import { Module } from '@nestjs/common';
import { MedicationLogsService } from './medicationLogs.service';
import { MedicationLogsResolver } from './medicationLogs.resolver';
import { MedicationLogsController } from './medicationLogs.controller';
import { IdService } from 'services/uuid/id.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationLogs } from './entities/medicationLogs.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { PatientsService } from 'src/patients/patients.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PrescriptionsFiles } from 'src/prescriptionsFiles/entities/prescriptionsFiles.entity';
import { PrescriptionFilesService } from 'src/prescriptionsFiles/prescriptionsFiles.service';
import { Notification } from 'src/notifications/entities/notification.entity';
import { EmergencyContacts } from 'src/emergencyContacts/entities/emergencyContacts.entity';
import { EmergencyContactsService } from 'src/emergencyContacts/emergencyContacts.service';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersPrescriptions } from 'src/orders_prescriptions/entities/orders_prescription.entity';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { OrdersPrescriptionsService } from 'src/orders_prescriptions/orders_prescriptions.service';
import { Orders } from 'src/orders/entities/order.entity';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { AppointmentsFiles } from 'src/appointmentsFiles/entities/appointmentsFiles.entity';
import { AppointmentFilesService } from 'src/appointmentsFiles/appointmentsFiles.service';
import { OrdersLaboratory } from 'src/orders_laboratory/entities/orders_laboratory.entity';
import { OrdersLaboratoryService } from 'src/orders_laboratory/orders_laboratory.service';
import { OrdersDietary } from 'src/orders_dietary/entities/orders_dietary.entity';
import { OrdersDietaryService } from 'src/orders_dietary/orders_dietary.service';
@Module({
  imports: [TypeOrmModule.forFeature([MedicationLogs, Prescriptions, Patients, PrescriptionsFiles, Notification, EmergencyContacts, Orders ,OrdersPrescriptions, Appointments, AppointmentsFiles, OrdersLaboratory, OrdersDietary])],
  providers: [MedicationLogsResolver, EmergencyContactsService,MedicationLogsService, IdService, PatientsService, PrescriptionsService, OrdersService, OrdersPrescriptionsService, AppointmentFilesService, AppointmentsService,PrescriptionFilesService, OrdersLaboratoryService, OrdersDietaryService],
  controllers: [MedicationLogsController],
})
export class MedicationLogsModule { }
