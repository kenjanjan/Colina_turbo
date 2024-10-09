import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersPrescriptionsService } from './orders_prescriptions.service';
import { CreateOrdersPrescriptionDto } from './dto/create-orders_prescription.dto';
import { UpdateOrdersPrescriptionDto } from './dto/update-orders_prescription.dto';

@Controller('orders-prescriptions')
export class OrdersPrescriptionsController {
  constructor(private readonly ordersPrescriptionsService: OrdersPrescriptionsService) {}

  @Post()
  create(@Body() createOrdersPrescriptionDto: CreateOrdersPrescriptionDto) {
    return this.ordersPrescriptionsService.create(createOrdersPrescriptionDto);
  }
  @Post('patient/:patientId') // Example route to trigger the function
  async getPrescriptionOrders(
    @Param('patientId') patientUuid: string,
    @Body() body: {
        term?: string; // Made optional with a default value in the service method
        page: number;
        sortBy: string;
        sortOrder: 'ASC' | 'DESC';
        perPage: number;
        filterStatus?: string[]; // Made optional with a default value in the service method
    }
): Promise<{
    data: any[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
}> {
    const { term = '', page = 1, sortBy , sortOrder = 'DESC', perPage = 4, filterStatus = [] } = body;
    
    return this.ordersPrescriptionsService.findPrescriptionOrdersByPatientUuid(patientUuid, term, filterStatus, sortBy, sortOrder, page, perPage);
}

  // @Get()
  // findAll() {
  //   return this.ordersPrescriptionsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.ordersPrescriptionsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrdersPrescriptionDto: UpdateOrdersPrescriptionDto) {
  //   return this.ordersPrescriptionsService.update(+id, updateOrdersPrescriptionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.ordersPrescriptionsService.remove(+id);
  // }
}
