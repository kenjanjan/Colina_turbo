import { Module } from '@nestjs/common';
import { PatientsResolver } from './patients.resolver';
import { PatientsController } from './patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patients } from './entities/patients.entity';
import { IdService } from 'services/uuid/id.service';
import { PatientsService } from './patients.service';
import { PatientsProfileImage } from 'src/patientsProfileImage/entities/patientsProfileImage.entity';
import { PatientsProfileImageService } from 'src/patientsProfileImage/patientsProfileImage.service';
import { EmergencyContactsService } from 'src/emergencyContacts/emergencyContacts.service';
import { EmergencyContacts } from 'src/emergencyContacts/entities/emergencyContacts.entity';
import { Orders } from 'src/orders/entities/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { OrdersLaboratory } from 'src/orders_laboratory/entities/orders_laboratory.entity';
import { OrdersLaboratoryService } from 'src/orders_laboratory/orders_laboratory.service';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { AppointmentsFiles } from 'src/appointmentsFiles/entities/appointmentsFiles.entity';
import { AppointmentFilesService } from 'src/appointmentsFiles/appointmentsFiles.service';
import { OrdersDietary } from 'src/orders_dietary/entities/orders_dietary.entity';
import { OrdersDietaryService } from 'src/orders_dietary/orders_dietary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, PatientsProfileImage, EmergencyContacts,Orders, OrdersLaboratory, Appointments, AppointmentsFiles, OrdersDietary])],

  providers: [PatientsResolver, PatientsService, EmergencyContactsService, IdService, PatientsProfileImageService, OrdersService, OrdersLaboratoryService, AppointmentFilesService, AppointmentsService, OrdersDietaryService],
  controllers: [PatientsController],
})
export class PatientsModule {}
