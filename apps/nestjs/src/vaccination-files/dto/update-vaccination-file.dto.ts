import { PartialType } from '@nestjs/mapped-types';
import { CreateVaccinationFileDto } from './create-vaccination-file.dto';
import { Field } from '@nestjs/graphql';

export class UpdateVaccinationFileDto extends PartialType(CreateVaccinationFileDto) {
    @Field()
    id: number;

    @Field()
    file_uuid: string;

    @Field()
    filename: string;

    @Field()
    vaccinationId: string;

    @Field()
    data: Uint8Array;
}
