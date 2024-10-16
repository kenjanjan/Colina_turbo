import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdersPrescriptionDto } from './create-orders_prescription.dto';

export class UpdateOrdersPrescriptionDto extends PartialType(CreateOrdersPrescriptionDto) {
    uuid: string;
    prescriptionId: number;
    orderId: number;
    status: string;

}

