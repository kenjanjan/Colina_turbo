import { Module } from '@nestjs/common';
import { OrdersPrescriptionsService } from './orders_prescriptions.service';
import { OrdersPrescriptionsController } from './orders_prescriptions.controller';
import { OrdersPrescriptions } from './entities/orders_prescription.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ OrdersPrescriptions])],

  controllers: [OrdersPrescriptionsController],
  providers: [OrdersPrescriptionsService],
})
export class OrdersPrescriptionsModule {}
