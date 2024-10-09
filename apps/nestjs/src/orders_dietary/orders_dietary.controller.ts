import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersDietaryService } from './orders_dietary.service';
import { CreateOrdersDietaryDto } from './dto/create-orders_dietary.dto';
import { UpdateOrdersDietaryDto } from './dto/update-orders_dietary.dto';

@Controller('orders-dietary')
export class OrdersDietaryController {
  constructor(private readonly ordersDietaryService: OrdersDietaryService) {}

  @Post()
  create(@Body() createOrdersDietaryDto: CreateOrdersDietaryDto) {
    return this.ordersDietaryService.create(createOrdersDietaryDto);
  }

  @Get()
  findAll() {
    return this.ordersDietaryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersDietaryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdersDietaryDto: UpdateOrdersDietaryDto) {
    return this.ordersDietaryService.update(+id, updateOrdersDietaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersDietaryService.remove(+id);
  }
}
