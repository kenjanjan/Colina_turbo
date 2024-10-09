import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdersLaboratoryDto } from './create-orders_laboratory.dto';

export class UpdateOrdersLaboratoryDto extends PartialType(CreateOrdersLaboratoryDto) {
    uuid: string;
    laboratoryId: number;
    orderId: number;
    status: string;

}
