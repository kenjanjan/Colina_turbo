import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VaccinationsFilesService } from './vaccination-files.service';
import { CreateVaccinationFileDto } from './dto/create-vaccination-file.dto';
import { UpdateVaccinationFileDto } from './dto/update-vaccination-file.dto';

@Controller('vaccination-files')
export class VaccinationFilesController {
  constructor(private readonly vaccinationFilesService: VaccinationsFilesService) {}

  // @Post()
  // create(@Body() createVaccinationFileDto: CreateVaccinationFileDto) {
  //   return this.vaccinationFilesService.create(createVaccinationFileDto);
  // }

  // @Get()
  // findAll() {
  //   return this.vaccinationFilesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.vaccinationFilesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateVaccinationFileDto: UpdateVaccinationFileDto) {
  //   return this.vaccinationFilesService.update(+id, updateVaccinationFileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.vaccinationFilesService.remove(+id);
  // }
}
