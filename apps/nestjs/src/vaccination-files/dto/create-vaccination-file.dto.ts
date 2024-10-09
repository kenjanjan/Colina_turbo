import { Field } from "@nestjs/graphql";

export class CreateVaccinationFileDto { 
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
