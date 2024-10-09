import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentsFilesDto } from './create-appointmentsFiles.dto';
import { Field } from '@nestjs/graphql';
export class UpdatePrescriptionsFileDto extends PartialType(CreateAppointmentsFilesDto) {     @Field()
    id: number;

    @Field()
    file_uuid: string;

    @Field()
    filename: string;

    @Field()
    labResultsId: string;

    @Field()
    data: Uint8Array;}
