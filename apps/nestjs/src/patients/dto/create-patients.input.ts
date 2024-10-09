import { InputType, Int, Field } from '@nestjs/graphql';
import { IsArray, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreatePatientsInput {
  @Field((type) => Int)
  id: number;

  @Field()
  uuid: string;

  @IsNotEmpty()
  @Field()
  firstName: string;

  @IsNotEmpty()
  @Field()
  lastName: string;

  @IsNotEmpty()
  @Field()
  middleName: string;

  @Field((type) => Int)
  age: number;

  @IsEmail()
  @Field()
  email: string;

  @IsNotEmpty()
  @Field()
  dateOfBirth: Date;


  @Field()
  gender: string;

  @Field()
  city: string;

  address1: string;
  address2: string;

  @Field()
  state: string;

  @Field()
  zip: string;

  @Field()
  country: string;

  @Field()
  phoneNo: string;

  @Field()
  codeStatus: string;

  dischargeDate?: Date;
  admissionDate?: Date;
  reAdmissionDate?: Date;
  incidentReportDate?: Date;
  admissionStatus?:string;


  @Field()
  updatedAt: string;

  @Field()
  createdAt: string;

  @Field()
  deletedAt: string;

  @IsArray()
  @IsOptional()
  emergencyContacts?: CreateEmergencyContactsInput[];

}

@InputType()
export class CreateEmergencyContactsInput {
  @Field((type) => Int)
  id: number;

  @Field()
  uuid: string;

  @Field()
  name: string;

  @Field()
  phoneNumber: string;

  @Field()
  patientRelationship: string;

  email:string; 

  @Field()
  patientId: number;

  @Field()
  updatedAt: string;

  @Field()
  createdAt: string;

  @Field()
  deletedAt: string;
}
