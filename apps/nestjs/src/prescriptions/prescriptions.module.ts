import { Module } from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { PrescriptionsResolver } from './prescriptions.resolver';
import { PrescriptionsController } from './prescriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescriptions } from './entities/prescriptions.entity';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import {PrescriptionsFiles} from 'src/prescriptionsFiles/entities/prescriptionsFiles.entity';
import { PrescriptionFilesService } from 'src/prescriptionsFiles/prescriptionsFiles.service';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';
import { EmergencyContacts } from 'src/emergencyContacts/entities/emergencyContacts.entity';
import { EmergencyContactsService } from 'src/emergencyContacts/emergencyContacts.service';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersPrescriptions } from 'src/orders_prescriptions/entities/orders_prescription.entity';
import { Orders } from 'src/orders/entities/order.entity';
import { OrdersPrescriptionsService } from 'src/orders_prescriptions/orders_prescriptions.service';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { AppointmentsFiles } from 'src/appointmentsFiles/entities/appointmentsFiles.entity';
import { AppointmentFilesService } from 'src/appointmentsFiles/appointmentsFiles.service';
import { OrdersLaboratory } from 'src/orders_laboratory/entities/orders_laboratory.entity';
import { OrdersLaboratoryService } from 'src/orders_laboratory/orders_laboratory.service';
import { OrdersDietary } from 'src/orders_dietary/entities/orders_dietary.entity';
import { OrdersDietaryService } from 'src/orders_dietary/orders_dietary.service';
@Module({
  imports: [TypeOrmModule.forFeature([Prescriptions, Patients, MedicationLogs, PrescriptionsFiles,MedicationLogs, EmergencyContacts, Orders, OrdersPrescriptions,Appointments, AppointmentsFiles,OrdersLaboratory, OrdersDietary])],

  providers: [PrescriptionsResolver, IdService, EmergencyContactsService,PrescriptionsService, PatientsService,PrescriptionFilesService, OrdersService, OrdersPrescriptionsService, AppointmentsService, AppointmentFilesService, OrdersDietaryService, OrdersLaboratoryService],
  controllers: [PrescriptionsController],
})
export class PrescriptionsModule { }
