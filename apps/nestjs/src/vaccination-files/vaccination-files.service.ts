import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdService } from 'services/uuid/id.service'; // Import the IdService
import { VaccinationFiles } from './entities/vaccination-file.entity';

@Injectable()
export class VaccinationsFilesService {
  constructor(
    @InjectRepository(VaccinationFiles)
    private vaccinationsFilesRepository: Repository<VaccinationFiles>,
    private idService: IdService, // Inject the IdService
  ) { }

  async uploadVaccinationFile(dataBuffer: Buffer, filename: string, vaccinationId: number) {
    const newFile = await this.vaccinationsFilesRepository.create({
      file_uuid: this.idService.generateRandomUUID("VFF-"),
      vaccinationId: vaccinationId,
      filename,
      data: dataBuffer,
    });
    await this.vaccinationsFilesRepository.save(newFile);
    return newFile;
  }
  async getFilesByVaccinationId(vaccinationId: number) {
    const files = await this.vaccinationsFilesRepository.find({
      where: { vaccinationId: vaccinationId },
    });
    if (!files || files.length === 0) {
      throw new NotFoundException(`No files found for vaccination with ID ${vaccinationId}`);
    }
    return files;
  }

  async getFileByVaccinationFileUuid(vaccinationFileUuid: string) {
    const { id: vaccinationFileId } = await this.vaccinationsFilesRepository.findOne({
      select: ['id'],
      where: { file_uuid: vaccinationFileUuid },
    });
    if (!vaccinationFileId) {
      throw new NotFoundException(`Vaccination file with UUID ${vaccinationFileUuid} not found`);
    }

    const file = await this.vaccinationsFilesRepository.findOne({
      where: { id: vaccinationFileId },
    });    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }
  
  async softDeleteVaccinationFile(vaccinationFileUuid: string): Promise<VaccinationFiles> {
    console.log(`Delete Vaccination File`, vaccinationFileUuid);

    const vaccinationFile = await this.vaccinationsFilesRepository.findOne({ where: { file_uuid: vaccinationFileUuid } });

    if (!vaccinationFile) {
      throw new NotFoundException(`Vaccination File ID-${vaccinationFileUuid} not found.`);
    }

    vaccinationFile.deletedAt = new Date().toISOString();

    try {
      return await this.vaccinationsFilesRepository.save(vaccinationFile);
    } catch (error) {
      console.error(`Error saving vaccination file with UUID ${vaccinationFileUuid}:`, error);
      throw new Error(`Failed to soft delete vaccination file with UUID ${vaccinationFileUuid}`);
    }
  }

  async updateVaccinationFile(vaccinationId: number, dataBuffer: Buffer, filename: string): Promise<VaccinationFiles> {
    const existingVaccinationFile = await this.vaccinationsFilesRepository.findOne({
      where: { vaccinationId: vaccinationId }
    });

    if (!existingVaccinationFile) {
      throw new BadRequestException(`No existing vaccination file found for vaccination ID ${vaccinationId}`);
    }

    // existingVaccinationFile.data = dataBuffer;
    // existingVaccinationFile.filename = filename;

    const updatedVaccinationFile = await this.vaccinationsFilesRepository.save(existingVaccinationFile);

    if (!updatedVaccinationFile) {
      throw new BadRequestException(`Failed to update vaccination file for vaccination ID ${vaccinationId}`);
    }

    console.log(`Vaccination file updated successfully: ${updatedVaccinationFile}`);

    return updatedVaccinationFile;
  }
}
