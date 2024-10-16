import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrdersPrescriptionDto } from './dto/create-orders_prescription.dto';
import { OrdersPrescriptions } from './entities/orders_prescription.entity'; // Adjust import based on your structure
import {
  Brackets,
  Repository,
} from 'typeorm';
interface RawPrescriptionOrders {
  op_uuid: string; // UUID of the prescription order
  prescriptionuuid: string; // UUID of the prescription
  orderuuid: string; // UUID of the order
  ordertype: string; // Type of the order (e.g., prescription)
  appointmentuuid: string; // UUID of the appointment associated with the order
  dateissued: string; // Date the order was issued in ISO format
  medicinename: string; // Name of the medication
  dosage: string; // Dosage of the medication
  status: string; // Status of the prescription (e.g., Active)
  interval: string; // Interval for taking the medication
  frequency: string; // Frequency for taking the medication
  prescriptiontype: string; // Type of the prescription
  startdate: string; // Start date of the prescription in ISO format
  enddate: string; // End date of the prescription in ISO format
}

@Injectable()
export class OrdersPrescriptionsService {
  constructor(
    @InjectRepository(OrdersPrescriptions)
    private ordersPrescriptionsRepository: Repository<OrdersPrescriptions>,
  ) { }

  async create(createOrdersPrescriptionDto: CreateOrdersPrescriptionDto): Promise<OrdersPrescriptions> {
    const orderPrescription = this.ordersPrescriptionsRepository.create(createOrdersPrescriptionDto);
    return await this.ordersPrescriptionsRepository.save(orderPrescription);
  }
  async findByPrescriptionId(prescriptionId: number): Promise<OrdersPrescriptions> {
    const orderPrescription = await this.ordersPrescriptionsRepository.findOne({
      where: { prescriptionId: prescriptionId },
    });
    if (!orderPrescription) {
      throw new NotFoundException(`Order-Prescription with Prescription ID-${prescriptionId} not found.`);
    }
    console.log(orderPrescription,"orderpresc id")
    console.log(prescriptionId,"prescriptionId id")
    return orderPrescription;
  }
  
  async updateStatus(id: number, status: string): Promise<OrdersPrescriptions> {
    const orderPrescription = await this.findByPrescriptionId(id);
    orderPrescription.status = status;
    return await this.ordersPrescriptionsRepository.save(orderPrescription);
  }
  
  async findPrescriptionOrdersByPatientUuid(
    patientUuid: string,
    term: string = '',
    filterStatus: string[] = [],
    sortBy: string = 'orderDate', // Set default value for sortBy
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    page: number = 1,
    perPage: number = 4
): Promise<{
    data: RawPrescriptionOrders[]; // Use the new type here
    totalPages: number;
    currentPage: number;
    totalCount: number;
}> {
    const skip = (page - 1) * perPage;
    const searchTerm = `%${term}%`;

    const ordersQueryBuilder = this.ordersPrescriptionsRepository
        .createQueryBuilder('op')
        .leftJoinAndSelect('op.prescription', 'p')
        .leftJoinAndSelect('op.order', 'o')
        .leftJoinAndSelect('o.appointment', 'a')
        .leftJoinAndSelect('p.patient', 'pa')
        .where('pa.uuid = :patientUuid', { patientUuid })
        .select([
            'op.uuid AS op_uuid',               // Prescription Order UUID
            'p.uuid AS p_uuid',                  // Prescription UUID
            'o.uuid AS o_uuid',                  // Order UUID
            'o.orderType AS o_orderType',        // Order Type
            'a.uuid AS a_uuid',                  // Appointment UUID
            'a.appointmentDoctor AS appointmentDoctor',
            'a.appointmentType AS appointmentType',
            'a.appointmentTime AS appointmentTime',
            'a.appointmentDate AS appointmentDate',
            'a.appointmentEndTime AS appointmentEndTime',
            'a.appointmentStatus AS appointmentStatus',
            'a.rescheduleReason AS rescheduleReason',
            'a.details AS details',
            'o.orderDate AS o_orderDate',        // Date Issued
            'p.name AS p_name',                  // Medication Name
            'p.dosage AS p_dosage',              // Dosage
            'p.status AS p_status',              // Status
            'p.interval AS p_interval',          // Interval
            'p.frequency AS p_frequency',        // Frequency
            'p.prescriptionType AS p_prescriptionType', // Prescription Type
            'p.startDate AS p_startDate',        // Start Date
            'p.endDate AS p_endDate'             // End Date
        ])
        .orderBy(`${sortBy}`, sortOrder)
        .offset(skip)
        .limit(perPage);

    // Filter by status if provided
    if (filterStatus && filterStatus.length > 0) {
        ordersQueryBuilder.andWhere('p.status IN (:...filterStatus)', { filterStatus });
    }

    // Search term if provided
    if (term) {
        ordersQueryBuilder.andWhere(
            new Brackets((qb) => {
                qb.andWhere('o.uuid ILIKE :searchTerm', { searchTerm })
                    .orWhere('p.name ILIKE :searchTerm', { searchTerm })
                    .orWhere('p.uuid ILIKE :searchTerm', { searchTerm });
            })
        );
    }

    const rawOrders = await ordersQueryBuilder
        .getRawMany();

    const totalCount = await ordersQueryBuilder.getCount();
    const totalPages = Math.ceil(totalCount / perPage); // Calculate total pages
  
    return {
        data: rawOrders, // Directly return raw orders from the query
        totalPages,
        currentPage: page,
        totalCount,
    };
}



  // Other methods (findAll, findOne, update, remove) remain the same
}
