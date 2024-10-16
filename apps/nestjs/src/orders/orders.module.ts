import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entities/order.entity';
import { OrdersLaboratory } from 'src/orders_laboratory/entities/orders_laboratory.entity';
import { OrdersLaboratoryService } from 'src/orders_laboratory/orders_laboratory.service';
import { IdService } from 'services/uuid/id.service';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import { AppointmentFilesService } from 'src/appointmentsFiles/appointmentsFiles.service';
import { AppointmentsFiles } from 'src/appointmentsFiles/entities/appointmentsFiles.entity';
import { EmergencyContacts } from 'src/emergencyContacts/entities/emergencyContacts.entity';
import { EmergencyContactsService } from 'src/emergencyContacts/emergencyContacts.service';
import { LabResults } from 'src/labResults/entities/labResults.entity';
import LabResultsFiles from 'src/labResultsFiles/entities/labResultsFiles.entity';
import { LabResultsService } from 'src/labResults/labResults.service';
import { LabResultsFilesService } from 'src/labResultsFiles/labResultsFiles.service';
import { OrdersDietaryService } from 'src/orders_dietary/orders_dietary.service';
import { OrdersDietary } from 'src/orders_dietary/entities/orders_dietary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ Orders, OrdersLaboratory, Appointments, Patients, AppointmentsFiles, EmergencyContacts, OrdersDietary])],
  controllers: [OrdersController, ],
  providers: [OrdersService, PatientsService, IdService, OrdersLaboratoryService, OrdersService, AppointmentsService, PatientsService, EmergencyContactsService, OrdersDietaryService, AppointmentFilesService],
})
export class OrdersModule {}
