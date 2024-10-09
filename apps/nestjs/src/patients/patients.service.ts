import { Injectable } from '@nestjs/common';
import { CreatePatientsInput } from './dto/create-patients.input';
import { UpdatePatientsInput } from './dto/update-patients.input';
import { Patients } from './entities/patients.entity';
import { Brackets, ILike, In, Like, Repository } from 'typeorm';
import { IdService } from 'services/uuid/id.service'; //
import {
  HttpException,
  HttpStatus,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import {
  ProcessedPatient,
  fullPatientInfo,
} from './entities/processedPatientInterface';
import { EmergencyContacts } from 'src/emergencyContacts/entities/emergencyContacts.entity';
import { EmergencyContactsService } from 'src/emergencyContacts/emergencyContacts.service';
import { CreateEmergencyContactsInput } from 'src/emergencyContacts/dto/create-emergencyContacts.input';
import { DateTime } from 'luxon';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
    // @InjectRepository(Prescriptions)
    // private prescriptionRepository: Repository<Prescriptions>,
    @InjectRepository(EmergencyContacts)
    private emergencyContactsRepository: Repository<EmergencyContacts>,
    
    private emergencyContactService:EmergencyContactsService,
    private idService: IdService, // Inject the IdService
  ) {}

  //CREATE PATIENT INFO
  async createPatients(input: CreatePatientsInput): Promise<Patients> {
    // Check if a patient with similar information already exists
    const existingLowercaseboth = await this.patientsRepository.findOne({
      where: {
        firstName: Like(`%${input.firstName}%`),
        lastName: Like(`%${input.lastName}%`),
        dateOfBirth: input.dateOfBirth
      },
    });
    // If a patient with similar information exists, throw an error
    if (existingLowercaseboth) {
      throw new ConflictException('Patient already exists.');
    }

    // Create a new instance of the Patients entity
    const newPatients = new Patients();

    // Generate a UUID for the patient information
    const uuidPrefix = 'PTN-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    // Assign the generated UUID and creation date to the new patient information
    newPatients.uuid = uuid;
    newPatients.admissionStatus = 'Admitted';

    
    // Copy the properties from the input object to the new patient information
    Object.assign(newPatients, input);
    if (input.emergencyContacts) {
      const savedPatient = await this.patientsRepository.save(newPatients);
      if (newPatients.uuid && savedPatient) {
        await this.emergencyContactService.createEmergencyContacts(newPatients.uuid, input.emergencyContacts);
      }
      const result = { ...savedPatient };
      delete result.id;
      delete result.deletedAt;
      delete result.updatedAt;
      return result;
    }
    
  }

  
  //GET FULL PATIENT INFORMATION
  async getAllPatientsFullInfo(): Promise<Patients[]> {
    return this.patientsRepository.find();
  }

  //GET ONE  PATIENT INFORMATION VIA ID
  async getPatientOverviewById(id: string): Promise<ProcessedPatient[]> {
    const patientList = await this.patientsRepository.find({
      select: [
        'uuid',
        'firstName',
        'middleName',
        'lastName',
        'age',
        'gender',
        'codeStatus',
        'mobility',
        'dietaryRestrictions',
        
      ],
      where: { uuid: id },
      relations: ['allergies'],
    });

    const processedPatientList = patientList.map((patient) => {
      // const allergies = patient.allergies
      //   .map((allergies) => allergies.type)
      //   .join(', ');
      // return { ...patient, allergies };
      const uniqueAllergyTypes = [
        ...new Set(patient.allergies.map((allergy) => allergy.type)),
      ];

      return {
        ...patient,
        allergies: uniqueAllergyTypes.join(', '), // Join unique allergy types into a single string
      };
    });
    return processedPatientList;
  }

  async getPatientFullInfoById(id: string): Promise<fullPatientInfo[]> {
    const patientList = await this.patientsRepository.find({
      where: { uuid: id },
      relations: ['allergies'],
    });

    const processedPatientList = patientList.map((patient) => {
      const uniqueAllergyTypes = [
        ...new Set(patient.allergies.map((allergy) => allergy.type)),
      ];

      // Creating a copy of patient object to avoid mutating original data
      const processedPatient = { ...patient };

      // Deleting the uuid property from the copied object
      delete processedPatient.id;
      return {
        ...processedPatient,
        allergies: uniqueAllergyTypes.join(', '), // Join unique allergy types into a single string
      };
    });
    console.log(processedPatientList, 'pp');
    return processedPatientList;
  }

  //GET PAGED PATIENT LIST basic info for patient list with return to pages
  async getAllPatientsBasicInfo(
    term: string,
    page: number = 1,
    sortBy: string = 'lastName',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    perPage: number = 5,
  ): Promise<{
    data: Patients[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
  }> {
    const skip = (page - 1) * perPage;

    const queryBuilder = this.patientsRepository
      .createQueryBuilder('patient')
      .select([
        'patient.uuid',
        'patient.firstName',
        'patient.lastName',
        'patient.age',
        'patient.gender',
      ]);

    // // Check if the search term is a UUID
    // if (/^PTN/.test(term.toUpperCase())) {
    //   queryBuilder.where('patient.uuid LIKE :uuid', { uuid: `%${term.toUpperCase()}%` });
    // } else {
    //   const searchTerms = term.trim().toLowerCase().split(/\s+/);

    //   if (searchTerms.length > 1) {
    //     // Multiple words in search term
    //     const firstNameTerm = searchTerms.slice(0, -1).join(' ');
    //     const lastNameTerm = searchTerms[searchTerms.length - 1];
    //     const fullNameTerm = searchTerms.slice(0, -1).join(' ') + ' ' + searchTerms[searchTerms.length - 1];
    //     console.log(fullNameTerm, "fULL NAME:", "searching");
    //     console.log(searchTerms, "searchTerms :", "searching");

    //     console.log(firstNameTerm, "LAST NAME:", lastNameTerm, "searching");
    //     queryBuilder.where(
    //       `(
    //         (LOWER(patient.firstName) LIKE :firstName AND LOWER(patient.lastName) LIKE :lastName) OR
    //         (LOWER(patient.firstName) LIKE :fullName) OR
    //         (LOWER(patient.lastName) LIKE :fullName)
    //         OR
    //         (LOWER(CONCAT(patient.firstName, patient.lastName)) LIKE :fullName)
    //             OR
    //         (LOWER(CONCAT(patient.firstName, ' ', patient.lastName)) LIKE :fullName)
    //       )`,
    //       {
    //         firstName: `%${firstNameTerm}%`,
    //         lastName: `%${lastNameTerm}%`,
    //         fullName: `%${fullNameTerm}%`,
    //       }
    //     );

    //   } else {
    //     // Single word in search term
    //     const searchTerm = `%${term.toLowerCase()}%`;
    //     queryBuilder.where(
    //       `(LOWER(patient.firstName) LIKE :searchTerm OR LOWER(patient.lastName) LIKE :searchTerm)`,
    //       { searchTerm }
    //     );
    //   }
    // }
    if (term !== '') {
      console.log('term', term);
      const searchTerms = term.trim().toLowerCase().split(/\s+/);

      queryBuilder.where(
        new Brackets((qb) => {
          qb.orWhere(
            new Brackets((subQb) => {
              if (searchTerms.length > 1) {
                const firstNameTerm = searchTerms.slice(0, -1).join(' ');
                const lastNameTerm = searchTerms[searchTerms.length - 1];
                const fullNameTerm = searchTerms.join(' ');

                subQb
                  .andWhere(
                    new Brackets((subSubQb) => {
                      subSubQb
                        .where('LOWER(patient.firstName) LIKE :firstNameTerm', {
                          firstNameTerm: `%${firstNameTerm}%`,
                        })
                        .andWhere(
                          'LOWER(patient.lastName) LIKE :lastNameTerm',
                          { lastNameTerm: `%${lastNameTerm}%` },
                        );
                    }),
                  )
                  .orWhere(
                    new Brackets((subSubQb) => {
                      subSubQb
                        .where('LOWER(patient.firstName) LIKE :fullNameTerm', {
                          fullNameTerm: `%${fullNameTerm}%`,
                        })
                        .orWhere('LOWER(patient.lastName) LIKE :fullNameTerm', {
                          fullNameTerm: `%${fullNameTerm}%`,
                        });
                    }),
                  )
                  .orWhere(
                    new Brackets((subQb) => {
                      subQb
                        .where(
                          'LOWER(CONCAT(patient.firstName, patient.lastName)) = :fullNameTerm',
                          { fullNameTerm: `${fullNameTerm}` },
                        )
                        .orWhere(
                          "LOWER(CONCAT(patient.firstName, ' ', patient.lastName)) = :fullNameTerm",
                          { fullNameTerm: `${fullNameTerm}` },
                        );
                    }),
                  );
              } else {
                for (const word of searchTerms) {
                  subQb.andWhere(
                    new Brackets((subSubQb) => {
                      subSubQb
                        .where('patient.firstName ILIKE :word', {
                          word: `%${word}%`,
                        })
                        .orWhere('patient.lastName ILIKE :word', {
                          word: `%${word}%`,
                        });
                    }),
                  );
                }
              }
            }),
          );

          // Search for UUID directly
          if (searchTerms.length === 1) {
            const uuidTerm = `%${term.toUpperCase()}%`;
            qb.orWhere('patient.uuid LIKE :uuidTerm', { uuidTerm });
          }
        }),
      );
    }

    // Count the total rows searched
    const totalPatients = await queryBuilder.getCount();

    // Total number of pages
    const totalPages = Math.ceil(totalPatients / perPage);

    // Find the data with pagination and sorting
    const patientList = await queryBuilder
      .skip(skip)
      .take(perPage)
      .orderBy(`patient.${sortBy}`, sortOrder)
      .getMany();

    return {
      data: patientList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatients,
    };
  }

  async getAllPatientsFullName(): Promise<{
    data: Patients[];
  }> {
    const patientList = await this.patientsRepository.find({
      select: ['uuid', 'firstName', 'lastName'],
      order: { firstName: 'ASC' },
    });
    return {
      data: patientList,
    };
  }
  async getAllPatientsWithDetails(): Promise<Patients[]> {
    return this.patientsRepository.find({
      relations: [
        'medicationLogs',
        'vitalSigns',
        'medical_history',
        'lab_results',
        // 'notes',
        'appointments',
        'emergencyContacts',
        'prescriptions',
        'adls'
      ],
    });
  }

  async getPatientRecentInfo(id: string): Promise<{
    data: Patients[];
    recentMedication: any[];
    recentPRN: any[];
    totalMedicationDue: number;
    totalMedicationDone: number;
    patientAllergies: any;
  }> {
    const patientExists = await this.patientsRepository.findOne({
      where: { uuid: id },
      select: ['id'],
    });
    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }

    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    const medicationCountSubQuery = this.patientsRepository
      .createQueryBuilder('patient')
      .innerJoin('patient.medicationlogs', 'medicationlogs')
      .innerJoin(
        'patient.prescriptions',
        'prescriptions',
        'prescriptions.status = :status',
        { status: 'active' },
      )
      .select('COUNT(medicationlogs.id)', 'medicationCount')
      .where(
        'medicationlogs.patientId = :id and medicationlogs.prescriptionId = prescriptions.id',
        { id: patientExists.id },
      )
      .andWhere('medicationlogs.medicationLogStatus = :medicationLogStatus', {
        medicationLogStatus: 'pending',
      })
      .andWhere('medicationlogs.medicationLogsDate = :today', {
        today: formattedToday,
      });

    const medicationDoneCount = this.patientsRepository
      .createQueryBuilder('patient')
      .innerJoin('patient.medicationlogs', 'medicationlogs')
      .innerJoin(
        'patient.prescriptions',
        'prescriptions',
        'prescriptions.status = :status',
        { status: 'active' },
      )
      .select('COUNT(medicationlogs.id)', 'medicationCount')
      .where(
        'medicationlogs.patientId = :id and medicationlogs.prescriptionId = prescriptions.id',
        { id: patientExists.id },
      )
      .andWhere('medicationlogs.medicationType = :medicationType', {
        medicationType: 'ASCH',
      })
      .andWhere('medicationlogs.medicationLogStatus != :medicationLogStatus', {
        medicationLogStatus: 'pending',
      })
      .andWhere('medicationlogs.medicationLogsDate = :today', {
        today: formattedToday,
      })
      .andWhere('prescriptions.status = :status', { status: 'active' });

    const patientRecentInfo = this.patientsRepository
      .createQueryBuilder('patient')
      .leftJoin('patient.vitalsign', 'vitalsign')
      .leftJoin('patient.allergies', 'allergies')
      .select([
        'patient.firstName',
        'patient.lastName',
        'patient.middleName',
        'patient.age',
        'patient.admissionDate',
        'patient.gender',
        'patient.age',
        'patient.dateOfBirth',
        'patient.address1',
        'patient.phoneNo',
      ])
      .addSelect(
        "COALESCE(vitalsign.bloodPressure, 'No Blood Pressure')",
        'bloodPressure',
      )
      .addSelect("COALESCE(vitalsign.heartRate, 'No Heart Rate')", 'heartRate')
      .addSelect(
        "COALESCE(vitalsign.temperature, 'No Temperature')",
        'temperature',
      )
      .addSelect(
        "COALESCE(vitalsign.respiratoryRate, 'No Respiratory Rate')",
        'respiratoryRate',
      )
      .addSelect("COALESCE(vitalsign.date, 'No Date')", 'vsdate')
      .addSelect("COALESCE(vitalsign.time, 'No Time')", 'vstime')
      .where('patient.uuid = :uuid', { uuid: id })
      .addOrderBy('vitalsign.createdAt', 'DESC')
      .limit(1);

    // Get the most recent medication log
    const recentMedicationQuery = this.patientsRepository
      .createQueryBuilder('patient')
      .innerJoin('patient.medicationlogs', 'medicationlogs')
      .select([
        'medicationlogs.medicationLogsName',
        'medicationlogs.medicationLogsTime',
        'medicationlogs.medicationLogsDate',
        'medicationlogs.medicationLogsDosage',
        'medicationlogs.medicationType',
      ])
      .where('patient.uuid = :uuid', { uuid: id })
      .andWhere('medicationlogs.medicationLogStatus != :medicationLogStatus', {
        medicationLogStatus: 'pending',
      })
      .andWhere('medicationlogs.medicationType = :medicationType', {
        medicationType: 'ASCH',
      })
      .orderBy('medicationlogs.medicationLogsDate', 'DESC')
      .addOrderBy('medicationlogs.medicationLogsTime', 'DESC')
      .limit(1);

    const mostRecentLog = await recentMedicationQuery.getRawOne();
    console.log(mostRecentLog, 'most recent');
    let allRecentLogs: any[] = [];
    if (mostRecentLog) {
      const medicationLogsDate =
        mostRecentLog.medicationlogs_medicationLogsDate;
      const medicationLogsTime =
        mostRecentLog.medicationlogs_medicationLogsTime;
      console.log(medicationLogsDate, 'medicationDate');
      // Get all logs that have the same most recent date and time
      const allRecentLogsQuery = this.patientsRepository
        .createQueryBuilder('patient')
        .innerJoin('patient.medicationlogs', 'medicationlogs')
        .select([
          'medicationlogs.medicationLogsName',
          'medicationlogs.medicationLogsTime',
          'medicationlogs.medicationLogsDate',
          'medicationlogs.medicationLogsDosage',
          'medicationlogs.medicationType',
        ])
        .where('patient.uuid = :uuid', { uuid: id })
        .andWhere('medicationlogs.medicationLogStatus != :stat', {
          stat: 'pending',
        })
        .andWhere('medicationlogs.medicationLogsDate = :medicationLogsDate', {
          medicationLogsDate,
        })
        .andWhere('medicationlogs.medicationLogsTime = :medicationLogsTime', {
          medicationLogsTime,
        })
        .orderBy('medicationlogs.createdAt', 'DESC');

      allRecentLogs = await allRecentLogsQuery.getRawMany();
      console.log(await allRecentLogsQuery.getRawMany(), 'allRecentLogs');
    }

    // Get the most recent medication log
    const recentMedicationPrnQuery = this.patientsRepository
      .createQueryBuilder('patient')
      .innerJoin('patient.medicationlogs', 'medicationlogs')
      .select([
        'medicationlogs.medicationLogsName',
        'medicationlogs.medicationLogsTime',
        'medicationlogs.medicationLogsDate',
        'medicationlogs.medicationLogsDosage',
        'medicationlogs.medicationType',
      ])
      .where('patient.uuid = :uuid', { uuid: id })
      .andWhere('medicationlogs.medicationLogStatus != :medicationLogStatus', {
        medicationLogStatus: 'pending',
      })
      .andWhere('medicationlogs.medicationType = :medicationType', {
        medicationType: 'PRN',
      })
      .orderBy('medicationlogs.medicationLogsDate', 'DESC')
      .addOrderBy('medicationlogs.medicationLogsTime', 'DESC')
      .limit(1);

    const mostRecentPrnLog = await recentMedicationPrnQuery.getRawOne();
    console.log(mostRecentPrnLog, 'most recent');
    let allRecentPrnLogs: any[] = [];
    if (mostRecentPrnLog) {
      const medicationLogsDate =
        mostRecentPrnLog.medicationlogs_medicationLogsDate;
      const medicationLogsTime =
        mostRecentPrnLog.medicationlogs_medicationLogsTime;
      console.log(medicationLogsDate, 'medicationDate');

      // Get all logs that have the same most recent date and time
      const allRecentPrnLogsQuery = this.patientsRepository
        .createQueryBuilder('patient')
        .innerJoin('patient.medicationlogs', 'medicationlogs')
        .select([
          'medicationlogs.medicationLogsName',
          'medicationlogs.medicationLogsTime',
          'medicationlogs.medicationLogsDate',
          'medicationlogs.medicationLogsDosage',
          'medicationlogs.medicationType',
        ])
        .where('patient.uuid = :uuid', { uuid: id })
        .andWhere('medicationlogs.medicationLogStatus != :stat', {
          stat: 'pending',
        })
        .andWhere('medicationlogs.medicationLogsDate = :medicationLogsDate', {
          medicationLogsDate,
        })
        .andWhere('medicationlogs.medicationLogsTime = :medicationLogsTime', {
          medicationLogsTime,
        })
        .orderBy('medicationlogs.createdAt', 'DESC');

      allRecentPrnLogs = await allRecentPrnLogsQuery.getRawMany();
      console.log(await allRecentPrnLogsQuery.getRawMany(), 'allRecentPrnLogs');
    }

    const allergensQuery = this.patientsRepository
      .createQueryBuilder('patient')
      .leftJoin('patient.allergies', 'allergies')
      .select("STRING_AGG(allergies.allergen, ', ')", 'allergens')
      .addSelect('allergies.severity')
      .where('patient.uuid = :uuid', { uuid: id })
      .groupBy('allergies.severity');

    const patientRecentInfoList = await patientRecentInfo.getRawMany();
    const patientAllergies = await allergensQuery.getRawMany();
    const totalMedicationCount = await medicationCountSubQuery.getRawOne();
    const totalMedicationDoneCount = await medicationDoneCount.getRawOne();
    
console.log(totalMedicationCount.medicationCount, 'totalMedicationCount');
    return {
      data: patientRecentInfoList,
      recentMedication:
        allRecentLogs.length > 0
          ? allRecentLogs
          : [
              {
                medicationLogsName: null,
                medicationLogsTime: null,
                medicationLogsDate: null,
              },
            ],
      recentPRN:
        allRecentPrnLogs.length > 0
          ? allRecentPrnLogs
          : [
              {
                medicationLogsName: null,
                medicationLogsTime: null,
                medicationLogsDate: null,
              },
            ],
      patientAllergies: patientAllergies,
      totalMedicationDue: totalMedicationCount.medicationCount,
      totalMedicationDone: totalMedicationDoneCount.medicationCount,
    };
  }

  async getPatientLatestReport(id: string): Promise<{
    data: Patients[];
    recentMedication: any;
    recentPRN: any;
    activeMeds: any;
    latestVitalSign: any;
    latestLabResult: any;
    latestAdls: any;
    // latestNotes: any;
    // latestIncidentReport: any;
  }> {
    const patientExists = await this.patientsRepository.findOne({
      where: { uuid: id },
      select: ['id'],
    });
    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Format date as YYYY-MM-DD

    const patientSummary = this.patientsRepository
      .createQueryBuilder('patient')
      .select([
        'patient.firstName',
        'patient.lastName',
        'patient.uuid',
        'patient.admissionDate',
      ])
      .where('patient.uuid = :uuid', { uuid: id });

    const recentASCHMedicationsQuery = this.patientsRepository
      .createQueryBuilder('patient')
      .innerJoin('patient.medicationlogs', 'medicationlogs')
      .select([
        'medicationlogs.medicationLogsName',
        'medicationlogs.medicationLogsTime',
        'medicationlogs.medicationLogsDosage',
        'medicationlogs.medicationLogsDate',
        'medicationlogs.medicationLogStatus',
        'medicationlogs.notes',
      ])
      .where('medicationlogs.medicationLogStatus != :stat', { stat: 'pending' })
      .andWhere('patient.uuid = :uuid', { uuid: id })
      .andWhere('medicationlogs.medicationType = :medicationLogsType', {
        medicationLogsType: 'ASCH',
      })
      .orderBy('medicationlogs.createdAt', 'DESC')
      .limit(1);

    const recentPRNMedicationsQuery = this.patientsRepository
      .createQueryBuilder('patient')
      .innerJoin('patient.medicationlogs', 'medicationlogs')
      .select([
        'medicationlogs.medicationLogsName',
        'medicationlogs.medicationLogsTime',
        'medicationlogs.medicationLogsDate',
        'medicationlogs.medicationLogStatus',
        'medicationlogs.notes',
      ])
      .where('patient.uuid = :uuid', { uuid: id })
      .andWhere('medicationlogs.medicationLogStatus != :stat', { stat: 'pending' })
      .andWhere('medicationlogs.medicationType = :medicationLogsType', {
        medicationLogsType: 'PRN',
      })
      .orderBy('medicationlogs.createdAt', 'DESC')
      .limit(1);

    const activeMedicationsQuery = this.patientsRepository
      .createQueryBuilder('patient')
      .innerJoin('patient.prescriptions', 'prescriptions')
      .select([
        'prescriptions.uuid',
        'prescriptions.name',
        'prescriptions.frequency',
        'prescriptions.dosage',
        'prescriptions.interval',
        'prescriptions.status',
      ])
      .where('patient.uuid = :uuid', { uuid: id })
      .andWhere('prescriptions.status = :status', { status: 'active' })
      .limit(6);

    const latestVitalSignQuery = this.patientsRepository
      .createQueryBuilder('patient')
      .innerJoin('patient.vitalsign', 'vitalsign')
      .select([
        'vitalsign.bloodPressure',
        'vitalsign.heartRate',
        'vitalsign.respiratoryRate',
        'vitalsign.temperature',
        'vitalsign.date',
        'vitalsign.time',
      ])
      .andWhere('vitalsign.date <= :dateToday', { dateToday: formattedToday })

      .where('patient.uuid = :uuid', { uuid: id })
      .orderBy('vitalsign.createdAt', 'DESC')
      .limit(1);

    const latestLabResultQuery = this.patientsRepository
      .createQueryBuilder('patient')
      .innerJoinAndSelect('patient.lab_results', 'lab_results')
      .select([
        'lab_results.hemoglobinA1c',
        'lab_results.fastingBloodGlucose',
        'lab_results.totalCholesterol',
        'lab_results.ldlCholesterol',
        'lab_results.hdlCholesterol',
        'lab_results.triglycerides',
        'lab_results.date',
        'lab_results.createdAt',
      ])
      .where('patient.uuid = :uuid', { uuid: id })
      .andWhere('lab_results.date <= :dateToday', { dateToday: formattedToday })
      .orderBy('lab_results.createdAt', 'DESC')
      .limit(1);

    const latestAdlsQuery = this.patientsRepository
      .createQueryBuilder('patient')
      .innerJoinAndSelect('patient.adl', 'adl')
      .select([
        'adl.adls',
        'adl.notes',
        'adl.createdAt',
      ])
      .where('patient.uuid = :uuid', { uuid: id })
      .andWhere('adl.createdAt <= :dateToday', { dateToday: formattedToday })
      .orderBy('adl.createdAt', 'DESC')
      .limit(1);

    // const latestNurseNotesQuery = this.patientsRepository
    //   .createQueryBuilder('patient')
    //   .innerJoinAndSelect('patient.notes', 'notes')
    //   .select(['notes.subject', 'notes.notes', 'notes.type', 'notes.createdAt'])
    //   .where('patient.uuid = :uuid', { uuid: id })
    //   .andWhere('notes.type = :type', { type: 'nn' })
    //   .orderBy('notes.createdAt', 'DESC')
    //   .limit(1);

    // const latestIncidentReportQuery = this.patientsRepository
    //   .createQueryBuilder('patient')
    //   .innerJoinAndSelect('patient.notes', 'notes')
    //   .select(['notes.subject', 'notes.notes', 'notes.type', 'notes.createdAt'])
    //   .where('patient.uuid = :uuid', { uuid: id })
    //   .andWhere('notes.type = :type', { type: 'ir' })
    //   .orderBy('notes.createdAt', 'DESC')
    //   .limit(1);

     

    const patientRecentInfoList = await patientSummary.getRawMany();
    const recentASCHMedication = await recentASCHMedicationsQuery.getRawOne(); // last medication taken
    const recentPRNMedication = await recentPRNMedicationsQuery.getRawOne(); // prn taken within the day
    const activeMedications = await activeMedicationsQuery.getRawMany(); //
    const latestLabResult = await latestLabResultQuery.getRawOne(); // latestLabResult
    const latestVitalSign = await latestVitalSignQuery.getRawOne(); // latest VitalSign
    // const latestNotes = await latestNurseNotesQuery.getRawOne(); // latest VitalSign
    // const latestIncidentReport = await latestIncidentReportQuery.getRawOne(); // latest VitalSign
    const latestAdls = await latestAdlsQuery.getRawOne(); 

    return {
      data: patientRecentInfoList,
      recentMedication: recentASCHMedication || {
        medicationLogsName: null,
        medicationLogsTime: null,
        medicationLogsDate: null,
      },
      recentPRN: recentPRNMedication
        ? recentPRNMedication
        : [
            {
              medicationLogsName: null,
              medicationLogsTime: null,
              medicationLogsDate: null,
            },
          ],
      activeMeds: activeMedications
        ? activeMedications
        : [
            {
              uuid: null,
              name: null,
              status: null,
              dosage: null,
              frequency: null,
              interval: null,
            },
          ],
      latestVitalSign: latestVitalSign || {
        bloodPressure: null,
        heartRate: null,
        respiratoryRate: null,
        temperature: null,
        date: null,
      },
      latestLabResult: latestLabResult || {
        hemoglobinA1c: null,
        fastingBloodGlucose: null,
        totalCholesterol: null,
        ldlCholesterol: null,
        hdlCholesterol: null,
        triglycerides: null,
        date: null,
      },
      latestAdls: latestAdls || {
        adls: null,
        notes: null,
        createdAt: null,
      },
      // latestNotes: latestNotes || {
      //   subject: null,
      //   notes: null,
      //   type: null,
      //   createdAt: null,
      // },
      // latestIncidentReport: latestIncidentReport || {
      //   subject: null,
      //   notes: null,
      //   type: null,
      //   createdAt: null,
      // },
       
    };
  }

  async updatePatients(
    id: string,
    updatePatientsInput: UpdatePatientsInput,
  ): Promise<Patients> {
    const { admissionStatus, dischargeDate, ...updateData } = updatePatientsInput;
  
    // Find the patient record by ID
    const patient = await this.patientsRepository.findOne({
      where: { uuid: id },
    });
    
  
    if (!patient) {
      throw new NotFoundException(`Patient ID-${id} not found.`);
    }
  
    // Check if admissionStatus is 'Discharge' and update dischargeDate to today's date
    if (admissionStatus === 'Discharge') {
      const todayDate = new Date();
      todayDate.setUTCHours(0, 0, 0, 0);
      const currentDateTime = DateTime.local(); 
      (updateData as any).dischargeDate = currentDateTime;
      (updateData as any).admissionStatus = 'Discharged';
    }
    if (admissionStatus === 'Re-admission') {
      const todayDate = new Date();
      todayDate.setUTCHours(0, 0, 0, 0);
      const currentDateTime = DateTime.local(); 
      (updateData as any).reAdmissionDate = currentDateTime;
      (updateData as any).admissionStatus = 'Re-admission';
    }
    if (admissionStatus === 'Incident Report') {
      const todayDate = new Date();
      todayDate.setUTCHours(0, 0, 0, 0);
      const currentDateTime = DateTime.local(); 
      (updateData as any).incidentReportDate = currentDateTime;
      (updateData as any).admissionStatus = 'Incident Report';
    }
  
    // Update the patient record with the new data
    Object.assign(patient, updateData);
  
    // Save the updated patient record
    return this.patientsRepository.save(patient);
  }

  async softDeletePatient(
    id: string,
  ): Promise<{ message: string; deletedPatient: Patients }> {
    // Find the patient record by ID
    const patient = await this.patientsRepository.findOne({
      where: { uuid: id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient ID-${id} does not exist.`);
    }

    // Set the deletedAt property to mark as soft deleted
    patient.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedPatient = await this.patientsRepository.save(patient);

    return {
      message: `Patient with ID ${id} has been soft-deleted.`,
      deletedPatient,
    };
  }
}
