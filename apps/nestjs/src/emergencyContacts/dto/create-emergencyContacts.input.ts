import { InputType, Int, Field } from '@nestjs/graphql';

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
