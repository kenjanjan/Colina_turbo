import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseInterceptors, UploadedFiles, BadRequestException, HttpStatus, NotFoundException } from '@nestjs/common';

import { Response, application } from 'express';
import { extname } from 'path';
import { FilesInterceptor } from '@nestjs/platform-express';
import { getFileValidator } from 'services/fileValidator/getFileValidator';
import { Readable } from 'typeorm/platform/PlatformTools';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';
import { VaccinationService } from './vaccination.service';
import { VaccinationsFilesService } from 'src/vaccination-files/vaccination-files.service';

@Controller('vaccination')
export class VaccinationController {
  constructor(private readonly vaccinationsService: VaccinationService,
    private readonly vaccinationsFilesService: VaccinationsFilesService
  ) { }
  

  @Post(':id')
  createVaccination(@Param('id') patientId: string, @Body() createVaccinationDto: CreateVaccinationDto) {
    return this.vaccinationsService.createVaccinationRecord(patientId, createVaccinationDto);
  }

  @Post('list/:id')
  findAllPatientVaccination(
    @Param('id') patientId: string,
    @Body() body: { term: string; page: number; sortBy: string; sortOrder: 'ASC' | 'DESC', perPage: number},
  ) {
    const { term = '', page, sortBy, sortOrder, perPage } = body;
    return this.vaccinationsService.getAllVaccinationByPatient(patientId, term, page, sortBy, sortOrder, perPage);
  }

  @Patch('update/:id')
  updateVaccination(@Param('id') id: string, @Body() updateVaccinationDto: UpdateVaccinationDto) {
    return this.vaccinationsService.updateVaccination(id, updateVaccinationDto);
  }

  @Patch('delete/:id')
  softDeleteVaccination(@Param('id') id: string) {
    return this.vaccinationsService.softDeleteVaccination(id);
  }
// Files placeholder
  @Post(':id/uploadfiles')
  @UseInterceptors(FilesInterceptor('vaccinationfile', 5)) // 'vaccinationfile' should match the field name in the vaccination data
  async addVaccinationFile(@Param('id') id: string, @UploadedFiles(getFileValidator()) files: Array<Express.Multer.File>) {
    console.log(`Received ID: ${id}`);

    // Ensure that 'files' is defined before accessing its properties
    if (files && files.length > 0) {
      for (const file of files) {
        if (file) {
          // Process each file if it is defined
          await this.vaccinationsService.addVaccinationFile(id, file.buffer, file.originalname);
        } else {
          // Handle undefined file elements
          console.warn('Undefined file element detected.');
        }
      }
      console.log(files);
    } else {
      // Handle the case where 'files' is undefined
      throw new BadRequestException('No file uploaded');
    }
  }

  @Patch(':id/updatefile')
  @UseInterceptors(FilesInterceptor('vaccinationfile', 1)) // Limiting to 1 file upload at a time
  async updateVaccinationFile(@Param('id') id: string, @UploadedFiles(getFileValidator()) files: Array<Express.Multer.File>) {
    console.log(`Received ID: ${id}`);

    // Check if a file has been uploaded
    if (files && files.length > 0) {
      const file = files[0]; // Since we expect only one file
      if (file) {
        // Call the service method to update the vaccination file
        const updatedVaccinationFile = await this.vaccinationsService.updateVaccinationFile(id, file.buffer, file.originalname);

        console.log(`Vaccination file updated: ${updatedVaccinationFile}`);
        return updatedVaccinationFile;
      } else {
        // Handle undefined file
        console.warn('Undefined file detected.');
        throw new BadRequestException('Invalid file uploaded');
      }
    } else {
      // Handle the case where no file was uploaded
      throw new BadRequestException('No file uploaded');
    }
  }
  @Get(':id/files') //get a list of files of that lab result
  async getDatabaseFilesById(@Param('id') id: string, response: Response) {
      try {
          const files = await this.vaccinationsService.getVaccinationFilesByUuid(id);
  
          // Return an array of file metadata (e.g., file IDs, filenames, file types)
          const fileMetadataArray = files.map(file => ({
              fileId: file.file_uuid,
              filename: file.filename,
              data: file.data,
          }));
  
          return fileMetadataArray;
      } catch (error) {
          if (error instanceof NotFoundException) {
              return {'Error': 'No files found'};
          }
          throw error; // Re-throw other errors
      }
  }
  @Get(':id/files/count')
  async getCurrentFileCountFromDatabase(@Param('id') id: string, @Res() response: Response) {
      try {
          const filesCount = await this.vaccinationsService.getCurrentFileCountFromDatabase(id);
          return response.status(HttpStatus.OK).json({ count: filesCount });
      } catch (error) {
          if (error instanceof NotFoundException) {
            return {'Error': 'No files found'};

          }
          return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
      }
  }
  async getFileById(@Param('id') id: string, @Param('fileId') fileId: string, @Res() response: Response): Promise<Response> {

    const file = await this.vaccinationsFilesService.getFileByVaccinationFileUuid(fileId);

    if (!file) {
        response.status(HttpStatus.NOT_FOUND).send(`File with File ID ${fileId} not found`);
        return;
    }


    // Set appropriate headers
    response.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    const fileExtension = extname(file.filename).toLowerCase();
    let contentType: string;

    switch (fileExtension) {
        case '.jpeg':
        case '.jpg':
            contentType = 'image/jpeg';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.pdf':
            contentType = 'application/pdf';
            break;
        default:
            contentType = 'application/octet-stream';
    }

    response.setHeader('Content-Type', contentType);

    // Create a readable stream from the file data
    const fileStream = Readable.from(file.data);

    // Pipe the file stream to the response

    return fileStream.pipe(response);
}
  @Patch('files/delete/:fileId')
  async softDeleteVaccinationFiles(@Param('fileId') fileUuid: string) {
    await this.vaccinationsService.softDeleteVaccination(fileUuid);
    console.log(`Delete Vaccination File`, fileUuid);
    return `Deleted Vaccination File ${fileUuid} Successfully`;
  }
}
