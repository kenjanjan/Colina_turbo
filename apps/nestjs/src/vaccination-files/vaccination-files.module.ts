import { Module } from '@nestjs/common';
import { VaccinationFilesController } from './vaccination-files.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patients } from 'src/patients/entities/patients.entity';
import { VaccinationFiles } from './entities/vaccination-file.entity';
import { Vaccination } from 'src/vaccination/entities/vaccination.entity';
import { EmergencyContacts } from 'src/emergencyContacts/entities/emergencyContacts.entity';
import { IdService } from 'services/uuid/id.service';
import { EmergencyContactsService } from 'src/emergencyContacts/emergencyContacts.service';
import { PatientsService } from 'src/patients/patients.service';
import { VaccinationsFilesService } from './vaccination-files.service';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, VaccinationFiles, Vaccination,EmergencyContacts])],

  controllers: [VaccinationFilesController],
  providers: [VaccinationsFilesService, IdService, EmergencyContactsService, PatientsService],
})
export class VaccinationFilesModule {}
