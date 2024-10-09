import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVaccinationDto } from './dto/create-vaccination.dto';
import { UpdateVaccinationDto } from './dto/update-vaccination.dto';
import { Brackets, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Vaccination } from './entities/vaccination.entity';
import { Patients } from 'src/patients/entities/patients.entity';
import { IdService } from 'services/uuid/id.service';
import { VaccinationsFilesService } from 'src/vaccination-files/vaccination-files.service';

@Injectable()
export class VaccinationService {

  constructor(
    @InjectRepository(Vaccination)
    private vaccinationRepository: Repository<Vaccination>,

    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,

    private vaccinationFilesService: VaccinationsFilesService,

    private idService: IdService, // Inject the IdService
  ) { }

  async createVaccinationRecord(
    patientUuid: string,
    vaccinationData: CreateVaccinationDto,
  ): Promise<Vaccination> {
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ['id'],
      where: { uuid: patientUuid },
    });
    const newVaccinationRecord = new Vaccination();
    const uuidPrefix = 'VRT-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newVaccinationRecord.uuid = uuid;
    newVaccinationRecord.patientId = patientId;
    Object.assign(newVaccinationRecord, vaccinationData);
    const savedVaccination = await this.vaccinationRepository.save(newVaccinationRecord);
    const result = { ...savedVaccination };
    delete result.patientId;
    delete result.deletedAt;
    delete result.updatedAt;
    delete result.id;
    return result;
  }



  async getAllVaccinationByPatient(
    patientUuid: string,
    term: string,
    page: number = 1,
    sortBy: string = 'dateIssued',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    perPage: number = 4,
  ): Promise<{
    data: Vaccination[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    const searchTerm = `%${term}%`; // Add wildcards to the search term
    const skip = (page - 1) * perPage;
    const patientExists = await this.patientsRepository.findOne({
      where: { uuid: patientUuid },
    });
    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }
    const vaccinationQueryBuilder = this.vaccinationRepository
      .createQueryBuilder('vaccination')
      .innerJoinAndSelect('vaccination.patient', 'patient')
      .select([
        'vaccination.uuid',
        'vaccination.vaccinatorName',
        'vaccination.vaccineManufacturer',
        'vaccination.healthFacility',
        'vaccination.dosageSequence',
        'vaccination.dateIssued',
        'patient.uuid',
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })
      .orderBy(`vaccination.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    if (term !== '') {
      console.log('term', term);
      vaccinationQueryBuilder
        .where(
          new Brackets((qb) => {
            qb.andWhere('patient.uuid = :uuid', { uuid: patientUuid });
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            qb.andWhere('vaccination.uuid ILIKE :searchTerm', { searchTerm })
              .orWhere('vaccination.vaccinatorName ILIKE :searchTerm', {
                searchTerm,
              })
              .orWhere('vaccination.vaccineManufacturer ILIKE :searchTerm', {
                searchTerm,
              })
              .orWhere('vaccination.healthFacility ILIKE :searchTerm', {
                searchTerm,
              });
          }),
        );
    }
    const vaccinationResultList = await vaccinationQueryBuilder.getRawMany();
    const totalPatientvaccination = await vaccinationQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientvaccination / perPage);
    return {
      data: vaccinationResultList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientvaccination,
    };
  }
  async updateVaccination(id: string, updatesVaccinationDto: UpdateVaccinationDto): Promise<Vaccination> {
    const { ...updateData } = updatesVaccinationDto;
    const vaccination = await this.vaccinationRepository.findOne({
      where: { uuid: id },
    });
    if (!vaccination) {
      throw new NotFoundException(`Vaccination  ID-${id}  not found.`);
    }
    Object.assign(vaccination, updateData);
    const updatedVaccination = await this.vaccinationRepository.save(vaccination);
    delete updatedVaccination.patientId;
    delete updatedVaccination.deletedAt;
    delete updatedVaccination.id;
    return updatedVaccination;
  }

  async softDeleteVaccination(
    id: string,
  ): Promise<{ message: string; deletedVaccination: Vaccination }> {
    const vaccination = await this.vaccinationRepository.findOne({
      where: { uuid: id },
    });
    if (!vaccination) {
      throw new NotFoundException(`Vaccination ID-${id} does not exist.`);
    }
    vaccination.deletedAt = new Date().toISOString();
    const deletedVaccination =
      await this.vaccinationRepository.save(vaccination);
    delete deletedVaccination.patientId;
    delete deletedVaccination.id;
    return {
      message: `Vaccination with ID ${id} has been soft-deleted.`,
      deletedVaccination,
    };
  }

  //FILES FOR VACCINATION PLACEHOLDER 
  async addVaccinationFile(formUuid: string, imageBuffer: Buffer, filename: string) {
    console.log(`Received formUuid: ${formUuid}`);

    // Ensure formUuid is provided
    if (!formUuid) {
      console.error("No formUuid provided.");
      throw new BadRequestException(`No form UUID provided`);
    }

    // Find the form by its UUID
    const { id: vaccinationId }  = await this.vaccinationRepository.findOne({
      select: ['id'],
      where: { uuid: formUuid },
    });

    // Check if form exists
    if (!vaccinationId) {
      throw new NotFoundException(`Vaccination with UUID ${formUuid} not found`);
    }

    // Upload the file for the form
    return this.vaccinationFilesService.uploadVaccinationFile(imageBuffer, filename, vaccinationId);
  }
  
// Service method
async getCurrentFileCountFromDatabase(vaccinationUuid: string): Promise<number> {
  const { id: formId } = await this.vaccinationRepository.findOne({
      select: ["id"],
      where: { uuid: vaccinationUuid }
  });

  try {
      const files = await this.vaccinationFilesService.getFilesByVaccinationId(formId);
      return files.length; // Return the number of files
  } catch (error) {
      throw new NotFoundException('Vaccination files not found');
  }
}
  async getVaccinationFilesByUuid(formUuid: string) {
    const form = await this.vaccinationRepository.findOne({
        select: ['id'],
        where: { uuid: formUuid },
    });

    if (!form) {
        throw new NotFoundException(`Vaccination with UUID ${formUuid} not found`);
    }

    const { id: vaccinationId } = form;

    const formFiles = await this.vaccinationFilesService.getFilesByVaccinationId(vaccinationId);
    if (!formFiles || formFiles.length === 0) {
        throw new NotFoundException(`No files found for form with UUID ${formUuid}`);
    }

    return formFiles;
}
  async updateVaccinationFile(formUuid: string, imageBuffer: Buffer, filename: string): Promise<any> {
    const form = await this.vaccinationRepository.findOne({
      where: { uuid: formUuid },
    });
    if (!form) {
      throw new NotFoundException(`Vaccination with UUID ${formUuid} not found`);
    }
    return this.vaccinationFilesService.updateVaccinationFile(form.id, imageBuffer, filename);
  }
}