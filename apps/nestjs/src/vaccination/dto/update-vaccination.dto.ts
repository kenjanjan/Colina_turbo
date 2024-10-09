import { PartialType } from '@nestjs/mapped-types';
import { Field } from '@nestjs/graphql';
import { CreateVaccinationDto } from './create-vaccination.dto';

export class UpdateVaccinationDto extends PartialType(CreateVaccinationDto) {
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
