import { Module } from '@nestjs/common';
import { OrdersDietaryService } from './orders_dietary.service';
import { OrdersDietaryController } from './orders_dietary.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersDietary } from './entities/orders_dietary.entity';
import { Orders } from 'src/orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ OrdersDietary,Orders])],

  controllers: [OrdersDietaryController],
  providers: [OrdersDietaryService,],
})
export class OrdersDietaryModule {}
