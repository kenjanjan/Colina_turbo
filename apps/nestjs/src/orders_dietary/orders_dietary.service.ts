import { Injectable } from '@nestjs/common';
import { CreateOrdersDietaryDto } from './dto/create-orders_dietary.dto';
import { UpdateOrdersDietaryDto } from './dto/update-orders_dietary.dto';

@Injectable()
export class OrdersDietaryService {
  create(createOrdersDietaryDto: CreateOrdersDietaryDto) {
    return 'This action adds a new ordersDietary';
  }

  findAll() {
    return `This action returns all ordersDietary`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ordersDietary`;
  }

  update(id: number, updateOrdersDietaryDto: UpdateOrdersDietaryDto) {
    return `This action updates a #${id} ordersDietary`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordersDietary`;
  }
}
