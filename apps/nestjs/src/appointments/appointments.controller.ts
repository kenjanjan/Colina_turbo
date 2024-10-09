import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseInterceptors, UploadedFiles, BadRequestException, HttpStatus, NotFoundException } from '@nestjs/common';
import { Response } from 'express';

import { AppointmentsService } from './appointments.service';
import { CreateAppointmentsInput } from './dto/create-appointments.input';
import { UpdateAppointmentsInput } from './dto/update-appointments.input';
import { FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { getFileValidator } from 'services/fileValidator/getFileValidator';
import { Readable } from 'stream';
import { AppointmentFilesService } from 'src/appointmentsFiles/appointmentsFiles.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentService: AppointmentsService,
    private readonly appointmentFilesService: AppointmentFilesService
  ) {}

  @Post('upcoming-appointments')
  getUpcomingAppointments(
    @Body()
    body: {
      term: string;
      page: number;
      sortBy: string;
      sortOrder: 'ASC' | 'DESC';
      perPage: number;
    },
  ) {
    const { term = '', page, sortBy, sortOrder, perPage } = body;
    return this.appointmentService.getUpcomingAppointments(
      term,
      page,
      sortBy,
      sortOrder,
      perPage,
    );
  }
  @Post(':id')
  createAppointments(
    @Param('id') patientId: string,
    @Body() createAppointmentsInput: CreateAppointmentsInput,
  ) {
    return this.appointmentService.createAppointments(
      patientId,
      createAppointmentsInput,
    );
  }
    @Post('get/all')
    getAllAppointments(
      @Body()
      body: {
        term: string;
        page: number;
        sortBy: string;
        sortOrder: 'ASC' | 'DESC';
        filterStatus: string[];
        filterType: string[];
        startDate: string;
        endDate: string;
      },
    ) {
      const { term = '',page, sortBy, sortOrder,filterStatus,filterType, startDate,endDate } = body;
      return this.appointmentService.getAllAppointments(
        term,
        page,
        sortBy,
        sortOrder,
        filterStatus,
        filterType,
        startDate,
        endDate,
      );
    }
  
  @Post('list/:id')
  findAllAppointmentsByPatient(
    @Param('id') patientId: string,
    @Body()
    body: {
      term: string;
      page: number;
      sortBy: string;
      sortOrder: 'ASC' | 'DESC';
      perPage: number;
      filterStatus: string[];
      filterType: string[];

    },
  ) {
    const { term = '', page, sortBy, sortOrder, perPage, filterStatus, filterType} = body;
    return this.appointmentService.getAllAppointmentsByPatient(
      patientId,
      term,
      page,
      sortBy,
      sortOrder,
      perPage,
      filterStatus,
      filterType,

    );
  }
  @Patch('update/:id')
  updateAppointments(
    @Param('id') id: string,
    @Body() updateAppointmentsInput: UpdateAppointmentsInput,
  ) {
    return this.appointmentService.updateAppointment(
      id,
      updateAppointmentsInput,
    );
  }
  @Patch(':id/mark-successful')
  async markAppointmentAsSuccessful(@Param('id') id: string) {
    await this.appointmentService.markAppointmentAsSuccessful(id);
    return { message: 'Appointment marked as successful' };
  }
  @Patch('delete/:id')
  deleteAppointments(@Param('id') id: string) {
    return this.appointmentService.softDeleteAppointment(id);
  }
//AppointmentFiles
@Post(':id/upload')
@UseInterceptors(FilesInterceptor('appointmentFile', 5))
addFile(
  @Param('id') id: string,
  @UploadedFiles(getFileValidator()) files: Array<Express.Multer.File>,
) {
  console.log(`Received ID: ${id}`);

  // Ensure that 'file' is defined before accessing its properties
  if (files && files.length > 0) {
    for (const file of files) {
      if (file) {
        // Process each file if it is defined
        this.appointmentService.addAppointmentFile(
          id,
          file.buffer,
          file.originalname,
        );
      } else {
        // Handle undefined file elements
        console.warn('Undefined file element detected.');
      }
    }
    console.log(files);
  } else {
    // Handle the case where 'file' is undefined
    throw new BadRequestException('No file uploaded');
  }
}
@Patch('files/delete/:fileId')
  async deleteFile(@Param('fileId') fileUuid: string) {
  
      await this.appointmentFilesService.softDeleteAppointmentFile(fileUuid);
      console.log(`Delete Prescription File`, fileUuid);
      return `Deleted Prescription File ${fileUuid} Successfully`;
  }
@Post(':id/uploadfiles')
@UseInterceptors(FilesInterceptor('appointmentfile', 5))
async addAppointmentFile(
  @Param('id') id: string,
  @UploadedFiles() files: Array<Express.Multer.File>,
) {
  console.log(`Received ID: ${id}`);

  if (!files || files.length === 0) {
    throw new BadRequestException('No file uploaded');
  }

  for (const file of files) {
    if (file) {
      await this.appointmentService.addAppointmentFile(
        id,
        file.buffer,
        file.originalname,
      );
    } else {
      console.warn('Undefined file element detected.');
    }
  }
}

@Patch(':id/updatefile')
@UseInterceptors(FilesInterceptor('appointmentfile', 1))
async updatePrescriptionFile(
  @Param('id') id: string,
  @UploadedFiles() files: Array<Express.Multer.File>,
) {
  console.log(`Received ID: ${id}`);

  if (!files || files.length === 0) {
    throw new BadRequestException('No file uploaded');
  }

  const file = files[0]; // Since we expect only one file
  if (!file) {
    throw new BadRequestException('Invalid file uploaded');
  }

  return this.appointmentService.updateAppointmentFile(
    id,
    file.buffer,
    file.originalname,
  );
}

@Get(':id/files')
async getDatabaseFilesById(@Param('id') id: string) {

  try {
    const files = await this.appointmentService.getAppointmentFilesByUuid(
      id,
    );
  
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
@Get(':id/files/count') //get a list of files of that lab result
async getCurrentFileCountFromDatabase(@Param('id') id: string, response: Response) {
  const files = await this.appointmentService.getCurrentFileCountFromDatabase(id);
  return files;
}
@Get(':id/files/:fileId')
async getFileById(
  @Param('id') id: string,
  @Param('fileId') fileId: string,
  @Res() response: Response,
): Promise<Response> {
  const file =
    await this.appointmentFilesService.getFileByAppointmentFileUuid(
      fileId,
    );

  if (!file) {
    response.status(HttpStatus.NOT_FOUND)
      .send(`File with File ID ${fileId} not found`);
    return;
  }

  response.setHeader(
    'Content-Disposition',
    `inline; filename="${file.filename}"`,
  );
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

  const fileStream = Readable.from(file.data);

  return fileStream.pipe(response);
}
}

