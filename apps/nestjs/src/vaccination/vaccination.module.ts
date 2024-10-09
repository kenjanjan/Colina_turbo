import { Module } from '@nestjs/common';
import { VaccinationService } from './vaccination.service';
import { VaccinationController } from './vaccination.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { EmergencyContactsService } from 'src/emergencyContacts/emergencyContacts.service';
import { EmergencyContacts } from 'src/emergencyContacts/entities/emergencyContacts.entity';
import { Patients } from 'src/patients/entities/patients.entity';
import { PatientsService } from 'src/patients/patients.service';
import { Vaccination } from './entities/vaccination.entity';
import { VaccinationFiles } from 'src/vaccination-files/entities/vaccination-file.entity';
import { VaccinationsFilesService } from 'src/vaccination-files/vaccination-files.service';

@Module({
  imports: [TypeOrmModule.forFeature([Vaccination, VaccinationFiles, Patients,EmergencyContacts])],
  controllers: [VaccinationController],
  providers: [VaccinationService, VaccinationsFilesService, IdService, EmergencyContactsService, PatientsService],
})
export class VaccinationModule {}
