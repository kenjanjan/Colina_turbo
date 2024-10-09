import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  uuid: string;
  
 
  patientId: string;

  @IsString()
  patientName: string;

  @IsString()
  notificationType: string;

  @IsOptional()
  @IsString()
  appointmentType?: string;

  @IsOptional()
  @IsString()
  medicationName?: string;

  @IsOptional()
  @IsString()
  medicationDosage?: string;

  @IsDateString()
  date: string;

  @IsString()
  time: string;

  @IsString()
  details: string;

  @IsString()
  status: string;

  @IsOptional()
  appointmentId?: number;

  @IsOptional()
  medicationLogId?: number;
}
