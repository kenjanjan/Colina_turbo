import { Module } from '@nestjs/common';
import { PrescriptionFilesService } from './prescriptionsFiles.service';
import { PrescriptionsFilesController } from './prescriptionsFiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import {PrescriptionsFiles} from './entities/prescriptionsFiles.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';
import { EmergencyContacts } from 'src/emergencyContacts/entities/emergencyContacts.entity';
import { EmergencyContactsService } from 'src/emergencyContacts/emergencyContacts.service';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersPrescriptions } from 'src/orders_prescriptions/entities/orders_prescription.entity';
import { OrdersPrescriptionsService } from 'src/orders_prescriptions/orders_prescriptions.service';
import { AppointmentFilesService } from 'src/appointmentsFiles/appointmentsFiles.service';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { AppointmentsFiles } from 'src/appointmentsFiles/entities/appointmentsFiles.entity';
import { Orders } from 'src/orders/entities/order.entity';
import { OrdersLaboratory } from 'src/orders_laboratory/entities/orders_laboratory.entity';
import { OrdersLaboratoryService } from 'src/orders_laboratory/orders_laboratory.service';
import { LabResults } from 'src/labResults/entities/labResults.entity';
import LabResultsFiles from 'src/labResultsFiles/entities/labResultsFiles.entity';
import { LabResultsService } from 'src/labResults/labResults.service';
import { LabResultsFilesService } from 'src/labResultsFiles/labResultsFiles.service';
import { OrdersDietary } from 'src/orders_dietary/entities/orders_dietary.entity';
import { OrdersDietaryService } from 'src/orders_dietary/orders_dietary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, PrescriptionsFiles, Prescriptions, MedicationLogs, EmergencyContacts, AppointmentsFiles, Appointments, Orders, OrdersPrescriptions, OrdersLaboratory,LabResults, LabResultsFiles, OrdersDietary])],

  controllers: [PrescriptionsFilesController],
  providers: [PrescriptionFilesService,EmergencyContactsService, IdService, PrescriptionsService, PatientsService, OrdersService, OrdersPrescriptionsService, AppointmentFilesService, AppointmentsService, OrdersLaboratoryService, LabResultsService,LabResultsFilesService, OrdersDietaryService],
})
export class PrescriptionFilesModule { }
