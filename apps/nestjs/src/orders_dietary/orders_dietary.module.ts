import { Module } from '@nestjs/common';
import { OrdersDietaryService } from './orders_dietary.service';
import { OrdersDietaryController } from './orders_dietary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersDietary } from './entities/orders_dietary.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ OrdersDietary])],

  controllers: [OrdersDietaryController],
  providers: [OrdersDietaryService],
})
export class OrdersDietaryModule {}
