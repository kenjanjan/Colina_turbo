import { Field } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateAppointmentsFilesDto {
    @Field()
    id: number;

    @Field()
    file_uuid: string;

    @Field()
    filename: string;

    @Field()
    appointmentsId: string;

    @Field()
    data: Uint8Array;

}
