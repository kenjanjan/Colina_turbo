import { Module } from '@nestjs/common';
import { AppointmentFilesService } from './appointmentsFiles.service';
import { AppointmentsFilesController } from './appointmentsFiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import { AppointmentsFiles } from './entities/appointmentsFiles.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { PrescriptionsService } from 'src/prescriptions/prescriptions.service';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { Appointments } from 'src/appointments/entities/appointments.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, AppointmentsFiles, Appointments, ])],

  controllers: [AppointmentsFilesController],
  providers: [AppointmentFilesService, IdService, AppointmentsService, PatientsService],
})
export class PrescriptionFilesModule { }
