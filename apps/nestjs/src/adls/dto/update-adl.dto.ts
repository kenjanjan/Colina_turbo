import { PartialType } from '@nestjs/mapped-types';
import { CreateAdlDto } from './create-adl.dto';

export class UpdateAdlDto extends PartialType(CreateAdlDto) {}
