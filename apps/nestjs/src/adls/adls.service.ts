import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdlDto } from './dto/create-adl.dto';
import { Adl } from './entities/adl.entity';
import { Brackets, Repository } from 'typeorm';
import { Patients } from 'src/patients/entities/patients.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { UpdateAdlDto } from './dto/update-adl.dto';
@Injectable()
export class AdlsService {

  constructor(
    @InjectRepository(Adl)
    private adlRepository: Repository<Adl>,

    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,

    private idService: IdService, // Inject the IdService
  ) {}

  async createAdl(
    patientUuid: string,
    adlData: CreateAdlDto,
  ): Promise<Adl> {
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ['id'],
      where: { uuid: patientUuid },
    });
    const newAdl = new Adl();
    const uuidPrefix = 'ADL-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newAdl.uuid = uuid;
    newAdl.patientId = patientId;
    Object.assign(newAdl, adlData);
    const saveAdl = await this.adlRepository.save(newAdl);
    const result = { ...saveAdl };
    delete result.patientId;
    delete result.deletedAt;
    delete result.updatedAt;
    delete result.id;
    return result;
  }

  async getAllAdlsByPatient(
    patientUuid: string,
    term: string,
    page: number = 1,
    sortBy: string = 'createdAt',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    perPage: number = 4,
  ): Promise<{
    data: Adl[];
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

    const adlQueryBuilder = this.adlRepository
      .createQueryBuilder('adl')
      .innerJoinAndSelect('adl.patient', 'patient')
      .select([
        'adl.uuid',
        'adl.adls',
        'adl.notes',
        'adl.createdAt',
        'patient.uuid',
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })
      .orderBy(`adl.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    if (term !== '') {
      console.log('term', term);
      adlQueryBuilder
        .where(
          new Brackets((qb) => {
            qb.andWhere('patient.uuid = :uuid', { uuid: patientUuid });
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            qb.andWhere('adl.uuid ILIKE :searchTerm', { searchTerm })
              .orWhere('adl.notes ILIKE :searchTerm', {
                searchTerm,
              })
              .orWhere('adl.adls ILIKE :searchTerm', {
                searchTerm,
              });
          }),
        );
    }
    const adlsResultList = await adlQueryBuilder.getRawMany();
    const totalPatientAdls = await adlQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientAdls / perPage);
    return {
      data: adlsResultList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientAdls,
    };
  }

  async updateAdl(
    id: string,
    updateAdlInput: UpdateAdlDto,
  ): Promise<Adl> {
    const { ...updateData } = updateAdlInput;
    const adls = await this.adlRepository.findOne({
      where: { uuid: id },
    });
    if (!adls) {
      throw new NotFoundException(`ADL  ID-${id}  not found.`);
    }
    Object.assign(adls, updateData);
    const updatedAdls= await this.adlRepository.save(adls);
    delete updatedAdls.patientId;
    delete updatedAdls.deletedAt;
    delete updatedAdls.id;
    return updatedAdls;
  }

  async softDeleteAdl(
    id: string,
  ): Promise<{ message: string; deletedAdl: Adl }> {
    const adl = await this.adlRepository.findOne({
      where: { uuid: id },
    });
    if (!adl) {
      throw new NotFoundException(`ADL ID-${id} does not exist.`);
    }
    adl.deletedAt = new Date().toISOString();
    const deletedAdl = await this.adlRepository.save(adl);
    delete deletedAdl.patientId;
    delete deletedAdl.id;
    return {
      message: `ADL with ID ${id} has been soft-deleted.`,
      deletedAdl,
    };
  }
}
