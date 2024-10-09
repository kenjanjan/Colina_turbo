import { Module } from '@nestjs/common';
import { AdlsService } from './adls.service';
import { AdlsController } from './adls.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patients } from 'src/patients/entities/patients.entity';
import { Adl } from './entities/adl.entity';
import { IdService } from 'services/uuid/id.service';

@Module({
  imports: [TypeOrmModule.forFeature([Adl, Patients])],
  controllers: [AdlsController],
  providers: [AdlsService,IdService],
})
export class AdlsModule {}
