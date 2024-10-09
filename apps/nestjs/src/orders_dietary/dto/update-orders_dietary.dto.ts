import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdersDietaryDto } from './create-orders_dietary.dto';

export class UpdateOrdersDietaryDto extends PartialType(CreateOrdersDietaryDto) {
    uuid: string;
    dietary: string;
    status: string;
    notes: string;
    orderId: number;

}
