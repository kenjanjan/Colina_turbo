import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    uuid: string;
    orderDate: string;
    appointmentId: number;
    orderType: string;
    status: string;
}
