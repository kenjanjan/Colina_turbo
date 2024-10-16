import { Module } from '@nestjs/common';
import { LabResultsService } from './labResults.service';
import { LabResultsResolver } from './labResults.resolver';
import { LabResultsController } from './labResults.controller';
import { LabResults } from './entities/labResults.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import LabResultsFiles from 'src/labResultsFiles/entities/labResultsFiles.entity';
import { LabResultsFilesService } from 'src/labResultsFiles/labResultsFiles.service';
import { EmergencyContacts } from 'src/emergencyContacts/entities/emergencyContacts.entity';
import { EmergencyContactsService } from 'src/emergencyContacts/emergencyContacts.service';
import { OrdersLaboratory } from 'src/orders_laboratory/entities/orders_laboratory.entity';
import { Orders } from 'src/orders/entities/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersLaboratoryService } from 'src/orders_laboratory/orders_laboratory.service';
import { AppointmentFilesService } from 'src/appointmentsFiles/appointmentsFiles.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { AppointmentsFiles } from 'src/appointmentsFiles/entities/appointmentsFiles.entity';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { OrdersDietary } from 'src/orders_dietary/entities/orders_dietary.entity';
import { OrdersDietaryService } from 'src/orders_dietary/orders_dietary.service';

@Module({
  imports: [TypeOrmModule.forFeature([LabResults, LabResultsFiles, Patients, EmergencyContacts, Orders, AppointmentsFiles,Appointments,OrdersLaboratory, OrdersDietary])],
  providers: [
    LabResultsResolver,
    LabResultsService,
    PatientsService,
    IdService,
    EmergencyContactsService,
    LabResultsFilesService,
    OrdersLaboratoryService,
     OrdersService,AppointmentFilesService, AppointmentsService,OrdersDietaryService
  ],

  controllers: [LabResultsController],
})
export class LabResultsModule {}
