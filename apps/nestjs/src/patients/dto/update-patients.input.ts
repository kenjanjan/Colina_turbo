import { IsNotEmpty } from 'class-validator';
import {
  CreateEmergencyContactsInput,
  CreatePatientsInput,
} from './create-patients.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePatientsInput extends PartialType(CreatePatientsInput) {
  id: number;
  uuid: string;
  firstName: string;
  lastName: string;
  age: number;
  dateOfBirth: Date;
  gender: string;
  city: string;
  address1: string;
  address2?: string;
  state: string;
  zip: string;
  country: string;
  phoneNo: string;
  codeStatus: string;
  dischargeDate?: Date;
  admissionDate?: Date;
  reAdmissionDate?: Date;
  incidentReportDate?: Date;
  admissionStatus?: string;
  updatedAt: string;
  createdAt: string;
  deletedAt: string;
  emergencyContacts?: CreateEmergencyContactsInput[];
}
