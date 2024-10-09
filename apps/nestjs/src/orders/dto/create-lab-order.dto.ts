
import { IsNotEmpty, IsOptional } from 'class-validator';

import { CreateOrderDto } from './create-order.dto';
import { CreateOrdersLaboratoryDto } from 'src/orders_laboratory/dto/create-orders_laboratory.dto';

export class CreateLabOrderDto {
  createOrderDto: CreateOrderDto;
  createOrdersLaboratoryDto: CreateOrdersLaboratoryDto;
}