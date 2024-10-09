import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdService } from 'services/uuid/id.service'; // Import the IdService
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { AppointmentsFiles } from './entities/appointmentsFiles.entity';

@Injectable()
export class AppointmentFilesService {
  constructor(
    @InjectRepository(AppointmentsFiles)
    private AppointmentFilesRepository: Repository<AppointmentsFiles>,
    @InjectRepository(Appointments)
    private AppointmentsRepository: Repository<Appointments>,
    private idService: IdService, // Inject the IdService
  ) {}

  async uploadAppointmentFile(dataBuffer: Buffer, filename: string, appointmentsId: number) {
    const newFile = await this.AppointmentFilesRepository.create({
      file_uuid: this.idService.generateRandomUUID("APF-"), // Generate UUID for file_uuid
      appointmentsId: appointmentsId,
      filename,
      data: dataBuffer,
    });
    await this.AppointmentFilesRepository.save(newFile);
    return newFile;
  }

  async getAppointmentFilesByAppointmentId(appointmentsUuid: number) {
    const files = await this.AppointmentFilesRepository.find({
      where: { appointmentsId: appointmentsUuid },
    });
    if (!files) {
      throw new NotFoundException(`No Appointment files found for Appointment ID ${appointmentsUuid}`);
    }
    return files;
  }

  async getFileByAppointmentFileUuid(appointmentsUuid: string) {
    const { id: appointmentsId } = await this.AppointmentFilesRepository.findOne({
      select: ['id'],
      where: { file_uuid: appointmentsUuid }, // Check if AppointmentsUuid is the correct field
    });
    const file = await this.AppointmentFilesRepository.findOne({
      where: { appointmentsId: appointmentsId },
    });
    if (!file) {
      throw new NotFoundException(`Appointment file not found for UUID ${appointmentsUuid}`);
    }
    return file;
  }

  async softDeleteAppointmentFile(appointmentFileUuid: string): Promise<AppointmentsFiles> {
    console.log(`Delete Appointment File`, appointmentFileUuid);

    const appointmentFile = await this.AppointmentFilesRepository.findOne({ where: { file_uuid: appointmentFileUuid } });

    if (!appointmentFile) {
      throw new NotFoundException(`Appointment file with UUID ${appointmentFileUuid} not found.`);
    }

    appointmentFile.deletedAt = new Date().toISOString();

    try {
      return await this.AppointmentFilesRepository.save(appointmentFile);
    } catch (error) {
      console.error(`Error saving Appointment file with UUID ${appointmentFileUuid}:`, error);
      throw new Error(`Failed to soft delete Appointment file with UUID ${appointmentFileUuid}`);
    }
  }

  async updateAppointmentFile(appointmentsId: number, imageBuffer: Buffer, filename: string): Promise<AppointmentsFiles> {
    // Retrieve the existing Appointment file associated with the Appointments ID
    const existingAppointmentFile = await this.AppointmentFilesRepository.findOne({
      where: { appointmentsId: appointmentsId },
    });

    // Handle the case where the existing Appointment file is not found
    if (!existingAppointmentFile) {
      throw new BadRequestException(`No existing Appointment file found for Appointments ID ${appointmentsId}`);
    }

    // Update the existing Appointment file's buffer and filename
    existingAppointmentFile.data = imageBuffer;
    existingAppointmentFile.filename = filename;

    // Save the updated Appointment file back to the repository
    const updatedAppointmentFile = await this.AppointmentFilesRepository.save(existingAppointmentFile);

    // Handle the case where the Appointment file update fails
    if (!updatedAppointmentFile) {
      throw new BadRequestException(`Failed to update Appointment file for Appointments ID ${appointmentsId}`);
    }

    console.log(`Appointment file updated successfully: ${updatedAppointmentFile}`);

    // Return the updated Appointment file
    return updatedAppointmentFile;
  }
}
