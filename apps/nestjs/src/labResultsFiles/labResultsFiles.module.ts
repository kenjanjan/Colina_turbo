import { Module } from '@nestjs/common';
import { LabResultsFilesService } from './labResultsFiles.service';
import { LabResultsFilesController } from './labResultsFiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import LabResultsFiles from './entities/labResultsFiles.entity';
import { IdService } from 'services/uuid/id.service';
import { LabResults } from 'src/labResults/entities/labResults.entity';
import { LabResultsService } from 'src/labResults/labResults.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { OrdersLaboratory } from 'src/orders_laboratory/entities/orders_laboratory.entity';
import { OrdersLaboratoryService } from 'src/orders_laboratory/orders_laboratory.service';
import { OrdersService } from 'src/orders/orders.service';
import { Orders } from 'src/orders/entities/order.entity';
import { AppointmentFilesService } from 'src/appointmentsFiles/appointmentsFiles.service';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { AppointmentsFiles } from 'src/appointmentsFiles/entities/appointmentsFiles.entity';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { OrdersDietary } from 'src/orders_dietary/entities/orders_dietary.entity';
import { OrdersDietaryService } from 'src/orders_dietary/orders_dietary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, LabResultsFiles, LabResults, OrdersLaboratory, Orders, Appointments, AppointmentsFiles, OrdersDietary])],

  controllers: [LabResultsFilesController],
  providers: [LabResultsFilesService, IdService, LabResultsService, OrdersLaboratoryService, OrdersService,AppointmentFilesService ,AppointmentsService, OrdersDietaryService],
})
export class LabResultsFilesModule {}
