import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrdersLaboratoryDto } from 'src/orders_laboratory/dto/create-orders_laboratory.dto';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }
  @Post('create-lab-order/:id')
  async createLab(  @Param('id') patientUuid: string,@Body() createLabOrderDto: CreateLabOrderDto, appointmentUuid:string) {
    
    return await this.ordersService.createLab(
      appointmentUuid,
      patientUuid
    );
  }
  //   @Post('laboratory/patient/:patientId') // Example route to trigger the function
  // async getLaboratoryOrders(@Param('patientId') patientId: string) {
  //   return await this.ordersService.findLaboratoryOrdersByPatientUuid(patientId);
  // }
  // @Get()
  // findAll() {
  //   return this.ordersService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ordersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.ordersService.update(+id, updateOrderDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersService.remove(+id);
  // }
}
