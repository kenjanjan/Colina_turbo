import { Logger, Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsResolver } from './appointments.resolver';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from './entities/appointments.entity';
import { IdService } from 'services/uuid/id.service';
import { PatientsService } from 'src/patients/patients.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import { AppointmentsFiles } from 'src/appointmentsFiles/entities/appointmentsFiles.entity';
import { AppointmentFilesService } from 'src/appointmentsFiles/appointmentsFiles.service';
import { EmergencyContacts } from 'src/emergencyContacts/entities/emergencyContacts.entity';
import { EmergencyContactsService } from 'src/emergencyContacts/emergencyContacts.service';

// import { AppointmentScheduler } from 'services/scheduler/appointment.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([Appointments, AppointmentsFiles, Patients, Notification,EmergencyContacts])],
  providers: [
    AppointmentsResolver,
    AppointmentsService,
    IdService,
    Logger,
    PatientsService,
    EmergencyContactsService,
    AppointmentFilesService
  ],

  controllers: [AppointmentsController],
})
export class AppointmentsModule {}
