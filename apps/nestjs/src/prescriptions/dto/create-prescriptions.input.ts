import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreatePrescriptionsInput {

  @Field()
  uuid: string;

  @Field()
  prescriptionType: string;

  @IsNotEmpty()
  @Field()
  name: string;

  @Field()
  status: string;

  @IsNotEmpty()
  @Field()
  dosage: string;

  @Field()
  frequency: string;

  @Field({ nullable: true })
  startDate?: string;

  @Field({ nullable: true })
  endDate?: string;  

  @Field()
  interval: string;

  @Field()
  patientId: number;

  @Field({ nullable: true })
  updatedAt: string;

  @Field({ nullable: true })
  createdAt: string;

  @Field({ nullable: true })
  deletedAt: string;

}
