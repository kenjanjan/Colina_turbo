import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdersLaboratoryService } from './orders_laboratory.service';
import { CreateOrdersLaboratoryDto } from './dto/create-orders_laboratory.dto';
import { UpdateOrdersLaboratoryDto } from './dto/update-orders_laboratory.dto';
import { OrdersService } from 'src/orders/orders.service';

@Controller('orders-laboratory')
export class OrdersLaboratoryController {
  constructor(private readonly ordersLaboratoryService: OrdersLaboratoryService,
  ) {}

  @Post()
  create(@Body() createOrdersLaboratoryDto: CreateOrdersLaboratoryDto) {
    return this.ordersLaboratoryService.create(createOrdersLaboratoryDto);
  }

  @Post('patient/:patientId')
  async getLaboratoryOrders(
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
    const { term = '', page = 1, sortBy = 'orderDate', sortOrder = 'DESC', perPage = 4, filterStatus = [] } = body;
      
      return this.ordersLaboratoryService.findLaboratoryOrdersByPatientUuid(patientUuid, term, filterStatus, sortBy, sortOrder, page, perPage);
  }

}
  
