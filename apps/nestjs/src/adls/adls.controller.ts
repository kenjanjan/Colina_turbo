import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdlsService } from './adls.service';
import { CreateAdlDto } from './dto/create-adl.dto';
import { UpdateAdlDto } from './dto/update-adl.dto';

@Controller('adls')
export class AdlsController {
  constructor(private readonly adlsService: AdlsService) {}

  @Post(':id')
  createAdl(@Param('id') patientId: string, @Body() createAdlDto: CreateAdlDto) {
    return this.adlsService.createAdl(patientId,createAdlDto);
  }

  @Post('list/:id')
    findAllPatientAdls(
        @Param('id') patientId: string,
        @Body() body: { term: string,  page: number, sortBy: string, sortOrder: 'ASC' | 'DESC', perPage: number}
    ) {
        const { term = "", page, sortBy, sortOrder, perPage } = body;
        return this.adlsService.getAllAdlsByPatient(patientId, term, page, sortBy, sortOrder, perPage);
    }

    @Patch('update/:id')
    updateAdl(@Param('id') id: string, @Body() updateAdlsInput: UpdateAdlDto) {
        return this.adlsService.updateAdl(id, updateAdlsInput);
    }

    @Patch('delete/:id')
    softDeleteAdl(@Param('id') id: string) {
        return this.adlsService.softDeleteAdl(id);
    }

}
