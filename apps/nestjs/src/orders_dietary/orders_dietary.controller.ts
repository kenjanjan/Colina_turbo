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

  @Post('patient/:patientId')
  async getDietaryOrder(
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
    const { term = '', page = 1, sortBy = 'dateIssued', sortOrder = 'DESC', perPage = 4, filterStatus = [] } = body;
      
      return this.ordersDietaryService.findDietaryOrdersByPatientUuid(patientUuid, term, filterStatus, sortBy, sortOrder, page, perPage);
  }
  @Patch('update/:orderUuid')
  updateDietaryOrder(@Param('orderUuid') id: string, @Body() updateDietaryOrder: UpdateOrdersDietaryDto) {
    return this.ordersDietaryService.updateOrdersDietary(id, updateDietaryOrder);
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
