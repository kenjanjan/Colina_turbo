import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentsInput } from './dto/create-appointments.input';
import { UpdateAppointmentsInput } from './dto/update-appointments.input';
import { InjectRepository } from '@nestjs/typeorm';
import { IdService } from 'services/uuid/id.service';
import { Brackets, Repository } from 'typeorm';
import { Appointments } from './entities/appointments.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Patients } from 'src/patients/entities/patients.entity';
import { AppointmentFilesService } from 'src/appointmentsFiles/appointmentsFiles.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointments)
    private appointmentsRepository: Repository<Appointments>,

    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,

    private readonly appointmentFilesService: AppointmentFilesService,
    private idService: IdService, // Inject the IdService
  ) {}

  async createAppointments(
    patientUuid: string,
    input: CreateAppointmentsInput,
  ): Promise<Appointments> {
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ['id'],
      where: { uuid: patientUuid },
    });
    const existingAppointment = await this.appointmentsRepository.findOne({
      where: {
        patientId: patientId,
        appointmentDate: input.appointmentDate,
        appointmentStatus: input.appointmentStatus,
        appointmentTime: input.appointmentTime,
        appointmentEndTime: input.appointmentEndTime,
      },
    });
    if (existingAppointment) {
      throw new ConflictException('Appointment already exists.');
    }
    const newAppointments = new Appointments();
    const uuidPrefix = 'APT-'; // Customize prefix as needed
    const uuid = this.idService.generateRandomUUID(uuidPrefix);
    newAppointments.uuid = uuid;
    newAppointments.patientId = patientId;
    Object.assign(newAppointments, input);
    const savedAppointments =
      await this.appointmentsRepository.save(newAppointments);
    const result = { ...savedAppointments };
    delete result.patientId;
    delete result.deletedAt;
    delete result.updatedAt;
    delete result.id;

    return result;
  }
  async findAppointmentIdByUuid(uuid: string): Promise<number> {
    const appointment = await this.appointmentsRepository.findOne({
      select: ['id'],
      where: { uuid: uuid },
    });
console.log(appointment.id, "YOI")
console.log(uuid, "YOI uuid")
    if (!appointment) {
      throw new NotFoundException('Appointment not found.');
    }

    return appointment.id; // Return the appointment ID
  }
  async getAllAppointmentsByPatient(
    patientUuid: string,
    term: string,
    page: number = 1,
    sortBy: string = 'appointmentStatus',
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    perPage: number = 4,
    filterStatus?: string[] | undefined,
    filterType?: string[] | undefined,
  ): Promise<{
    data: Appointments[];
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
    const appointmentsQueryBuilder = this.appointmentsRepository
      .createQueryBuilder('appointments')
      .innerJoinAndSelect('appointments.patient', 'patient')
      .select([
        'appointments.uuid',
        'appointments.dateCreated',
        'appointments.details',
        'appointments.appointmentTime',
        'appointments.appointmentStatus',
        'appointments.appointmentEndTime',
        'appointments.appointmentDate',
        'appointments.appointmentType',
        'appointments.rescheduleReason',
        'appointments.appointmentDoctor',
        'patient.uuid',
      ])
      .where('patient.uuid = :uuid', { uuid: patientUuid })

      .orderBy(`appointments.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    if (filterStatus && filterStatus.length > 0) {
      // Use `IN` clause to filter appointments based on multiple statuses
      appointmentsQueryBuilder.andWhere(
        'appointments.appointmentStatus IN (:...filterStatus)',
        {
          filterStatus: filterStatus,
        },
      );
    }
    const optionsFilterType = [
      'Podiatrist',
      'ER Visit',
      "Doctor's",
      'Dental',
      'Eye',
    ];
    if (filterType && filterType.length > 0) {
      if (filterType.includes("Others")) {
        // Get the specific types in filterType that are NOT "Others"
        const specificTypes = filterType.filter(type => type !== "Others");
    
        if (specificTypes.length > 0) {
          // Show both values not in optionsFilterType and the specific ones
          appointmentsQueryBuilder.andWhere(
            '(appointments.appointmentType NOT IN (:...optionsFilterType) OR appointments.appointmentType IN (:...specificTypes))',
            {
              optionsFilterType: optionsFilterType,
              specificTypes: specificTypes,
            },
          );
        } else {
          // If only "Others" is selected, show everything not in optionsFilterType
          appointmentsQueryBuilder.andWhere(
            'appointments.appointmentType NOT IN (:...optionsFilterType)',
            {
              optionsFilterType: optionsFilterType,
            },
          );
        }
      } else {
        // If "Others" is not included, just filter based on the selected types
        appointmentsQueryBuilder.andWhere(
          'appointments.appointmentType IN (:...filterType)',
          {
            filterType: filterType,
          },
        );
      }
    }
    console.log('PATIENT ID:', patientUuid);
    if (term !== '') {
      console.log('term', term);
      appointmentsQueryBuilder
        .where(
          new Brackets((qb) => {
            qb.andWhere('patient.uuid = :uuid', { uuid: patientUuid });
          }),
        )
        .andWhere(
          new Brackets((qb) => {
            qb.andWhere('appointments.uuid ILIKE :searchTerm', { searchTerm })
              .orWhere('appointments.appointmentStatus ILIKE :searchTerm', {
                searchTerm,
              })
              .orWhere('appointments.details ILIKE :searchTerm', {
                searchTerm,
              });
          }),
        );
      if (filterStatus && filterStatus.length > 0) {
        // Use `IN` clause to filter appointments based on multiple statuses
        appointmentsQueryBuilder.andWhere(
          'appointments.appointmentStatus IN (:...filterStatus)',
          {
            filterStatus: filterStatus,
          },
        );
      }
      if (filterType && filterType.length > 0) {
        if (filterType.includes("Others")) {
          // Get the specific types in filterType that are NOT "Others"
          const specificTypes = filterType.filter(type => type !== "Others");
      
          if (specificTypes.length > 0) {
            // Show both values not in optionsFilterType and the specific ones
            appointmentsQueryBuilder.andWhere(
              '(appointments.appointmentType NOT IN (:...optionsFilterType) OR appointments.appointmentType IN (:...specificTypes))',
              {
                optionsFilterType: optionsFilterType,
                specificTypes: specificTypes,
              },
            );
          } else {
            // If only "Others" is selected, show everything not in optionsFilterType
            appointmentsQueryBuilder.andWhere(
              'appointments.appointmentType NOT IN (:...optionsFilterType)',
              {
                optionsFilterType: optionsFilterType,
              },
            );
          }
        } else {
          // If "Others" is not included, just filter based on the selected types
          appointmentsQueryBuilder.andWhere(
            'appointments.appointmentType IN (:...filterType)',
            {
              filterType: filterType,
            },
          );
        }
      }
    }
    const appointmentsList = await appointmentsQueryBuilder.getRawMany();

    const totalPatientAppointments = await appointmentsQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientAppointments / perPage);

    return {
      data: appointmentsList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientAppointments,
    };
  }

  async getUpcomingAppointments(
    term: string,
    page: number = 1,
    sortBy: string = 'appointmentStatus',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    perPage: number = 5,
  ): Promise<{
    data: Appointments[];
    totalPages: number;
    currentPage: number;
    totalCount;
  }> {
    const searchTerm = `%${term}%`; // Add wildcards to the search term
    const todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);
    const skip = (page - 1) * perPage;

    const appointmentsQueryBuilder = this.appointmentsRepository
      .createQueryBuilder('appointments')
      .innerJoinAndSelect('appointments.patient', 'patient')
      .select([
        'appointments.uuid',
        'appointments.appointmentTime',
        'appointments.appointmentStatus',
        'appointments.appointmentEndTime',
        'appointments.appointmentDate',
        'patient.uuid',
        'patient.firstName',
        'patient.lastName',
        'patient.middleName',
      ])
      .where('appointments.appointmentDate >= :todayDate', {
        todayDate: todayDate.toISOString().split('T')[0],
      })
      .andWhere('appointments.appointmentStatus = :appointmentStatus', {
        appointmentStatus: 'Scheduled',
      })
      .orderBy(`appointments.${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);

    if (term !== '') {
      console.log('term', term);
      appointmentsQueryBuilder.where(
        new Brackets((qb) => {
          qb.andWhere('appointments.uuid ILIKE :searchTerm', { searchTerm })
            .orWhere('appointments.appointmentStatus ILIKE :searchTerm', {
              searchTerm,
            })
            .orWhere('appointments.details ILIKE :searchTerm', {
              searchTerm,
            });
        }),
      );
    }
    const appointmentsList = await appointmentsQueryBuilder.getRawMany();

    const totalPatientAppointments = await appointmentsQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientAppointments / perPage);

    return {
      data: appointmentsList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientAppointments,
    };
  }

  async getAllAppointments(
    term: string,
    page: number = 1,
    sortBy: string = 'appointmentStatus',
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    filterStatus?: string[] | undefined,
    filterType?: string[] | undefined,
    startDate: string = '2021-01-01',
    endDate: string = '2300-01-01',
    perPage: number = 5,
  ): Promise<{
    data: Appointments[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
  }> {
    const todayDate = new Date();
    todayDate.setUTCHours(0, 0, 0, 0);
    const skip = (page - 1) * perPage;
    const sortByMapping: { [key: string]: string } = {
      appointmentStatus: 'appointments.appointmentStatus',
      appointmentDate: 'appointments.appointmentDate',
      appointmentTime: 'appointments.appointmentTime',
      appointmentEndTime: 'appointments.appointmentEndTime',
      patient_firstName: 'patient.firstName',
    };
    const validSortBy =
      sortByMapping[sortBy] || 'appointments.appointmentStatus';

    const appointmentsQueryBuilder = this.appointmentsRepository
      .createQueryBuilder('appointments')
      .innerJoinAndSelect('appointments.patient', 'patient')
      .select([
        'appointments.uuid',
        'appointments.appointmentTime',
        'appointments.appointmentStatus',
        'appointments.appointmentEndTime',
        'appointments.appointmentDate',
        'patient.uuid',
        'patient.firstName',
        'patient.lastName',
        'patient.middleName',
      ])

      .where('appointments.appointmentDate >= :startDate', {
        startDate: startDate,
      })
      .andWhere('appointments.appointmentDate <= :endDate', {
        endDate: endDate,
      })
      .orderBy(validSortBy, sortOrder)
      .offset(skip)
      .limit(perPage);
    // if (filterStatus) {
    //   appointmentsQueryBuilder.andWhere('appointments.appointmentStatus = :filterStatus', { filterStatus: filterStatus })
    // }
    if (filterStatus && filterStatus.length > 0) {
      // Use `IN` clause to filter appointments based on multiple statuses
      appointmentsQueryBuilder.andWhere(
        'appointments.appointmentStatus IN (:...filterStatus)',
        {
          filterStatus: filterStatus,
        },
      );
    }
    const optionsFilterType = [
      'Podiatrist',
      'ER Visit',
      "Doctor's",
      'Dental',
      'Eye',
    ];
    if (filterType && filterType.length > 0) {
      if (filterType.includes("Others")) {
        // Get the specific types in filterType that are NOT "Others"
        const specificTypes = filterType.filter(type => type !== "Others");
    
        if (specificTypes.length > 0) {
          // Show both values not in optionsFilterType and the specific ones
          appointmentsQueryBuilder.andWhere(
            '(appointments.appointmentType NOT IN (:...optionsFilterType) OR appointments.appointmentType IN (:...specificTypes))',
            {
              optionsFilterType: optionsFilterType,
              specificTypes: specificTypes,
            },
          );
        } else {
          // If only "Others" is selected, show everything not in optionsFilterType
          appointmentsQueryBuilder.andWhere(
            'appointments.appointmentType NOT IN (:...optionsFilterType)',
            {
              optionsFilterType: optionsFilterType,
            },
          );
        }
      } else {
        // If "Others" is not included, just filter based on the selected types
        appointmentsQueryBuilder.andWhere(
          'appointments.appointmentType IN (:...filterType)',
          {
            filterType: filterType,
          },
        );
      }
    }
    if (term !== '') {
      console.log('term', term);
      const searchTerms = term.trim().toLowerCase().split(/\s+/);

      appointmentsQueryBuilder
        .where(
          new Brackets((qb) => {
            qb.andWhere('appointments.uuid ILIKE :searchTerm', {
              searchTerm: `%${term}%`,
            })
              .orWhere('appointments.appointmentStatus ILIKE :searchTerm', {
                searchTerm: `%${term}%`,
              })
              .orWhere('appointments.details ILIKE :searchTerm', {
                searchTerm: `%${term}%`,
              });
          }),
        )
        .orWhere(
          new Brackets((qb) => {
            if (searchTerms.length > 1) {
              const firstNameTerm = searchTerms.slice(0, -1).join(' ');
              const lastNameTerm = searchTerms[searchTerms.length - 1];
              const fullNameTerm = searchTerms.join(' ');
              console.log('FIRSTZZ', firstNameTerm);
              console.log('lastNameTerm', lastNameTerm);
              console.log('fullNameTerm', fullNameTerm);
              qb.andWhere(
                new Brackets((subQb) => {
                  subQb
                    .where('LOWER(patient.firstName) LIKE :firstNameTerm', {
                      firstNameTerm: `%${firstNameTerm}%`,
                    })
                    .andWhere('LOWER(patient.lastName) LIKE :lastNameTerm', {
                      lastNameTerm: `%${lastNameTerm}%`,
                    });
                }),
              )
                .orWhere(
                  new Brackets((subQb) => {
                    subQb
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
                qb.andWhere(
                  new Brackets((subQb) => {
                    subQb
                      .where('LOWER(patient.firstName) ILIKE :word', {
                        word: `%${word}%`,
                      })
                      .orWhere('LOWER(patient.lastName) ILIKE :word', {
                        word: `%${word}%`,
                      });
                  }),
                );
              }
            }
          }),
        );
      if (filterStatus && filterStatus.length > 0) {
        // Use `IN` clause to filter appointments based on multiple statuses
        appointmentsQueryBuilder.andWhere(
          'appointments.appointmentStatus IN (:...filterStatus)',
          {
            filterStatus: filterStatus,
          },
        );
      }
    }

    const appointmentsList = await appointmentsQueryBuilder.getRawMany();

    const totalPatientAppointments = await appointmentsQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientAppointments / perPage);

    return {
      data: appointmentsList,
      totalPages: totalPages,
      currentPage: page,
      totalCount: totalPatientAppointments,
    };
  }

  async updateAppointment(
    id: string,
    updateLabResultsInput: UpdateAppointmentsInput,
  ): Promise<Appointments> {
    const { ...updateData } = updateLabResultsInput;
    const labResults = await this.appointmentsRepository.findOne({
      where: { uuid: id },
    });
    if (!Appointments) {
      throw new NotFoundException(`Lab Result ID-${id}  not found.`);
    }
    Object.assign(labResults, updateData);
    return this.appointmentsRepository.save(labResults);
  }

  async softDeleteAppointment(
    id: string,
  ): Promise<{ message: string; deletedLabResult: Appointments }> {
    const appointments = await this.appointmentsRepository.findOne({
      where: { uuid: id },
    });
    if (!Appointments) {
      throw new NotFoundException(`Appointment ID-${id} does not exist.`);
    }
    appointments.deletedAt = new Date().toISOString();

    // Save and return the updated patient record
    const deletedLabResult =
      await this.appointmentsRepository.save(appointments);

    return {
      message: `Appointment with ID ${id} has been soft-deleted.`,
      deletedLabResult,
    };
  }

  getCurrentTimeFormatted(): string {
    const currentTime = new Date();
    let hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const meridiem = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    hours = hours % 12 || 12;

    // Pad single digit minutes with leading zero
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;

    // Format the time string
    const formattedTime = `${hours}:${paddedMinutes}${meridiem}`;

    return formattedTime;
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');

    // Format the time string
    const formattedDate = `${year}-${day}-${month}`; // Order: yyyy-dd-mm;
    return formattedDate;
  }
  async updateAppointmentStatusDefault() {
    const appointments = await this.appointmentsRepository.find(); // Retrieve all appointments from the database
    const currentTimeFormatted = this.getCurrentTimeFormatted();
    const currentDate = new Date(); // Get current date
    const formattedDate = this.formatDate(currentDate);
    console.log('Current Time:', currentTimeFormatted); // Log current time
    console.log('Current Date:', formattedDate); // Log current time

    for (const appointment of appointments) {
      if (
        formattedDate == appointment.appointmentDate &&
        currentTimeFormatted <= appointment.appointmentEndTime
      ) {
        appointment.appointmentStatus = 'ongoing';
      } else if (
        currentTimeFormatted > appointment.appointmentEndTime &&
        appointment.appointmentStatus !== 'Successful'
      ) {
        appointment.appointmentStatus = 'Missed';
      }
      console.log('Current Time:', currentTimeFormatted); // Log current time

      return this.appointmentsRepository.save(appointment);
    }
  }
  async markAppointmentAsSuccessful(id: string) {
    const appointment = await this.appointmentsRepository.findOne({
      where: { uuid: id },
    });
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    appointment.appointmentStatus = 'Successful';
    await this.appointmentsRepository.save(appointment);
  }

  //APPOINTMENT FILES FROM APPOINTMENTFILES SERVICE
  async addAppointmentFile(
    appointmentUuid: string,
    imageBuffer: Buffer,
    filename: string,
  ) {
    console.log(`Received appointmentUuid: ${appointmentUuid}`);

    // Ensure appointmentUuid is provided
    if (!appointmentUuid) {
      console.error('No appointmentUuid provided.');
      throw new BadRequestException(`No appointment UUID provided`);
    }

    // Find the appointment by its UUID
    const { id: appointmentId } = await this.appointmentsRepository.findOne({
      select: ['id'],
      where: { uuid: appointmentUuid },
    });

    // Check if appointment exists
    if (!appointmentId) {
      throw new NotFoundException(
        `Appointment with UUID ${appointmentUuid} not found`,
      );
    }

    // Upload the file for the appointment
    return this.appointmentFilesService.uploadAppointmentFile(
      imageBuffer,
      filename,
      appointmentId,
    );
  }

  // Service method
  async getCurrentFileCountFromDatabase(
    appointmentUuid: string,
  ): Promise<number> {
    const { id: appointmentId } = await this.appointmentsRepository.findOne({
      select: ['id'],
      where: { uuid: appointmentUuid },
    });

    try {
      const files =
        await this.appointmentFilesService.getAppointmentFilesByAppointmentId(
          appointmentId,
        );
      return files.length; // Return the number of files
    } catch (error) {
      throw new NotFoundException('Appointment files not found');
    }
  }
  async getAppointmentFilesByUuid(appointmentUuid: string) {
    const appointment = await this.appointmentsRepository.findOne({
      select: ['id'],
      where: { uuid: appointmentUuid },
    });

    if (!appointment) {
      throw new NotFoundException(
        `Appointment with UUID ${appointmentUuid} not found`,
      );
    }

    const { id: appointmentId } = appointment;

    const appointmentFiles =
      await this.appointmentFilesService.getAppointmentFilesByAppointmentId(
        appointmentId,
      );
    if (!appointmentFiles || appointmentFiles.length === 0) {
      throw new NotFoundException(
        `No files found for appointment with UUID ${appointmentUuid}`,
      );
    }

    return appointmentFiles;
  }
  async updateAppointmentFile(
    appointmentUuid: string,
    imageBuffer: Buffer,
    filename: string,
  ): Promise<any> {
    const appointment = await this.appointmentsRepository.findOne({
      where: { uuid: appointmentUuid },
    });
    if (!appointment) {
      throw new NotFoundException(
        `Appointment with UUID ${appointmentUuid} not found`,
      );
    }
    return this.appointmentFilesService.updateAppointmentFile(
      appointment.id,
      imageBuffer,
      filename,
    );
  }
}
