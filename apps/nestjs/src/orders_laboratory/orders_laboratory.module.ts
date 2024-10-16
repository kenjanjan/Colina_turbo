import { Module } from '@nestjs/common';
import { OrdersLaboratoryService } from './orders_laboratory.service';
import { OrdersLaboratoryController } from './orders_laboratory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersLaboratory } from './entities/orders_laboratory.entity';
import { IdService } from 'services/uuid/id.service';
import { LabResults } from 'src/labResults/entities/labResults.entity';
import { LabResultsService } from 'src/labResults/labResults.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import { LabResultsFilesService } from 'src/labResultsFiles/labResultsFiles.service';
import LabResultsFiles from 'src/labResultsFiles/entities/labResultsFiles.entity';
import { EmergencyContacts } from 'src/emergencyContacts/entities/emergencyContacts.entity';
import { EmergencyContactsService } from 'src/emergencyContacts/emergencyContacts.service';
import { Orders } from 'src/orders/entities/order.entity';
import { AppointmentFilesService } from 'src/appointmentsFiles/appointmentsFiles.service';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { AppointmentsFiles } from 'src/appointmentsFiles/entities/appointmentsFiles.entity';
import { OrdersService } from 'src/orders/orders.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { OrdersDietary } from 'src/orders_dietary/entities/orders_dietary.entity';
import { OrdersDietaryService } from 'src/orders_dietary/orders_dietary.service';

@Module({
  imports: [TypeOrmModule.forFeature([ OrdersLaboratory, LabResults, Patients, LabResultsFiles, EmergencyContacts, Orders, AppointmentsFiles, Appointments, OrdersDietary])],

  controllers: [OrdersLaboratoryController],
  providers: [OrdersLaboratoryService, IdService, LabResultsService, PatientsService, LabResultsFilesService, EmergencyContactsService, OrdersService,AppointmentFilesService, AppointmentsService, OrdersDietaryService],
})
export class OrdersLaboratoryModule {}
