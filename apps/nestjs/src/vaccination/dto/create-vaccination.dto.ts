import { InputType, Field } from '@nestjs/graphql';

export class CreateVaccinationDto {
    @Field()
    id: number;
  
    @Field()
    uuid: string;
  
    @Field()
    vaccinatorName: string;

    @Field()
    vaccineManufacturer: string;

    @Field()
    healthFacility: string;
  
    @Field()
    dosageSequence: string;
  
    @Field()
    dateIssued: string;

}
