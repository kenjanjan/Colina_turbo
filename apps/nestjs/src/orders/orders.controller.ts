import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CreateOrdersLaboratoryDto } from 'src/orders_laboratory/dto/create-orders_laboratory.dto';
import { CreateLabOrderDto } from './dto/create-lab-order.dto';
import { CreateOrdersDietaryDto } from 'src/orders_dietary/dto/create-orders_dietary.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }
  @Post('create-lab-order/:id')
  async createLab(
    @Param('id') patientUuid: string,
    @Body() createLabOrderDto: CreateLabOrderDto, // Add this to extract other DTO data if needed
    @Body('appointmentUuid') appointmentUuid: string // Extract appointmentUuid from the body
  ) {
    return await this.ordersService.createLab(
      appointmentUuid,
      patientUuid
    );
  }
  
  @Post('create-dietary-order/:id')
  async createDietary(  @Param('id') patientUuid: string,@Body() createOrdersDietaryDto: CreateOrdersDietaryDto, appointmentUuid:string, notes: string, dietary:string) {
    
    return await this.ordersService.createDietary(
      appointmentUuid,
      patientUuid,
      createOrdersDietaryDto

    );
  }
  //   @Post('laboratory/patient/:patientId') // Example route to trigger the function
  // async getLaboratoryOrders(@Param('patientId') patientId: string) {
  //   return await this.ordersService.findLaboratoryOrdersByPatientUuid(patientId);
  // }
  @Post('findPatientOrders')
  findAllByPatient(@Body() body: { patientUuid: string; orderType: string }) {
    const { patientUuid, orderType } = body;
    return this.ordersService.getAllOrdersByPatient(patientUuid, orderType);
  }
  @Post('findPatientPendingLabOrders')
  findPendingLab(@Body() body: { patientUuid: string; orderType: string }) {
    const { patientUuid, orderType } = body;
    return this.ordersService.getPendingLabOrdersByPatient(patientUuid);
  }

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
