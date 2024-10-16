import { CreateOrdersLaboratoryDto } from './dto/create-orders_laboratory.dto';
import { UpdateOrdersLaboratoryDto } from './dto/update-orders_laboratory.dto';
import { OrdersLaboratory } from './entities/orders_laboratory.entity';
import { IdService } from 'services/uuid/id.service';
import {
  Brackets,
  Repository,
  EntityManager,
} from 'typeorm';
import { InjectRepository, } from '@nestjs/typeorm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { LabResults } from 'src/labResults/entities/labResults.entity';
import { Orders } from 'src/orders/entities/order.entity';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { Patients } from 'src/patients/entities/patients.entity';
interface RawOrdersLaboratory {
  ordersLaboratoryUuid: string;
  laboratoryUuid: string;
  orderUuid: string;
  orderType: string;
  appointmentUuid: string;
  dateIssued: Date; // or string, depending on how you handle dates
  status: string;
  patientUuid: string;
  labResultDate: Date; // or string
  labResultHemoglobinA1c: number | null; // Use appropriate types
  labResultFastingBloodGlucose: number | null;
  labResultTotalCholesterol: number | null;
  labResultLDLCholesterol: number | null;
  labResultHDLCholesterol: number | null;
  labResultTriglycerides: number | null;
}

export class OrdersLaboratoryService {
  constructor(
    @InjectRepository(OrdersLaboratory)
    private readonly ordersLaboratoryRepository: Repository<OrdersLaboratory>,
    
  ) { }

  async create(createOrdersLaboratoryDto: CreateOrdersLaboratoryDto): Promise<OrdersLaboratory> {
    const orderLaboratory = this.ordersLaboratoryRepository.create({
      ...createOrdersLaboratoryDto,
    });
    return await this.ordersLaboratoryRepository.save(orderLaboratory);
  }




  async findLaboratoryOrdersByPatientUuid(
    patientUuid: string,
    term: string = '',
    filterStatus: string[] = [],
    sortBy: string = 'dateIssued', // Set default value for sortBy
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    page: number = 1,
    perPage: number = 4
  ): Promise<{
    data: RawOrdersLaboratory[]; // Use the new type here
    totalPages: number;
    currentPage: number;
    totalCount: number;
  }> {
    const skip = (page - 1) * perPage;
    const searchTerm = `%${term}%`;
    // Define allowed sort fields
    // const allowedSortFields = ['orderDate', 'status', 'orderType']; // Add more fields as necessary

    // // Validate sortBy
    // if (!allowedSortFields.includes(sortBy)) {
    //     throw new Error(`Invalid sortBy field: ${sortBy}`);
    // }
    const laboratoryOrdersQueryBuilder = this.ordersLaboratoryRepository
      .createQueryBuilder('orders_laboratory')
      .select([
        'orders_laboratory.uuid AS ordersLaboratoryUuid',
        'COALESCE(lab.uuid, \'-\') AS laboratoryUuid',
        'order.uuid AS orderUuid',
        'order.orderType AS orderType',
        'appointment.uuid AS appointmentUuid',
        'appointment.appointmentDoctor AS appointmentDoctor',
        'appointment.appointmentType AS appointmentType',
        'appointment.appointmentDate AS appointmentDate',
        'appointment.appointmentEndTime AS appointmentEndTime',
        'appointment.appointmentTime AS appointmentTime',
        'appointment.appointmentStatus AS appointmentStatus',
        'appointment.rescheduleReason AS rescheduleReason',
        'appointment.details AS details',
        'order.orderDate AS dateIssued',
        'orders_laboratory.status AS status',
        'pa.uuid AS patientUuid',
        'lab.date AS labResultDate',
        'lab.hemoglobinA1c AS labResultHemoglobinA1c',
        'lab.fastingBloodGlucose AS labResultFastingBloodGlucose',
        'lab.totalCholesterol AS labResultTotalCholesterol',
        'lab.ldlCholesterol AS labResultLDLCholesterol',
        'lab.hdlCholesterol AS labResultHDLCholesterol',
        'lab.triglycerides AS labResultTriglycerides',
      ])
      .leftJoin('orders_laboratory.lab', 'lab')
      .innerJoin('orders_laboratory.order', 'order')
      .innerJoin('order.appointment', 'appointment')
      .innerJoin('order.patient', 'pa')
      .where('pa.uuid = :patientUuid', { patientUuid })
      .orderBy(`${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
    // Apply filterStatus if provided
    if (filterStatus.length > 0) {
      laboratoryOrdersQueryBuilder.andWhere(
        'orders_laboratory.status IN (:...filterStatus)',
        { filterStatus }
      );
    }

    // Apply search term if provided
    if (term) {
      laboratoryOrdersQueryBuilder.andWhere(
        new Brackets((qb) => {
          qb.andWhere('order.uuid ILIKE :searchTerm', { searchTerm })
            .orWhere('order.orderDate::text ILIKE :searchTerm', { searchTerm });
        })
      );
    }

    // Get the total count before applying pagination
    const totalCount = await laboratoryOrdersQueryBuilder.getCount();

    // Apply pagination
    const laboratoryOrders: RawOrdersLaboratory[] = await laboratoryOrdersQueryBuilder
      .getRawMany();

    const totalPages = Math.ceil(totalCount / perPage); // Calculate total pages

    return {
      data: laboratoryOrders,
      totalPages,
      currentPage: page,
      totalCount,
    };
  }

  // Update the OrdersLaboratory with lab result ID and status
  async updateOrdersLaboratory(orderId: number, laboratoryId: number): Promise<OrdersLaboratory> {
    
    const orderLaboratory = await this.ordersLaboratoryRepository.findOne({
      where: { orderId:orderId },
    });
    console.log(orderLaboratory, "orderlaboratory")
    if (!orderLaboratory) {
      throw new NotFoundException(`OrderLaboratory with orderId ${orderId} not found`);
    }

    // Update the necessary fields
    orderLaboratory.laboratoryId = laboratoryId;
    orderLaboratory.status = 'completed';

  // Check for duplicate values
  const existingOrderLaboratory = await this.ordersLaboratoryRepository.findOne({
    where: { laboratoryId: orderLaboratory.laboratoryId, status: orderLaboratory.status },
  });

  if (existingOrderLaboratory) {
    throw new ConflictException(`OrderLaboratory with laboratoryId ${orderLaboratory.laboratoryId} and status ${orderLaboratory.status} already exists`);
  }
    return await this.ordersLaboratoryRepository.save(orderLaboratory);
  }
}
