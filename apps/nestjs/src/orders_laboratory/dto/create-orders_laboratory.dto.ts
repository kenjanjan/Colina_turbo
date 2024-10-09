import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateOrdersLaboratoryDto {
    uuid: string;
    @IsOptional()
    laboratoryId?: number; // Make laboratoryId optional
    @IsOptional()
    orderId: number;
    status: string;
    patientId:number
}
