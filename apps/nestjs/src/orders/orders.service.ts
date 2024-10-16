import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { Orders } from './entities/order.entity'; // Adjust import based on your structure
import { OrdersLaboratoryService } from 'src/orders_laboratory/orders_laboratory.service';
import { CreateOrdersLaboratoryDto } from 'src/orders_laboratory/dto/create-orders_laboratory.dto';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { IdService } from 'services/uuid/id.service';
import { Console } from 'console';
import { Patients } from 'src/patients/entities/patients.entity';
import { OrdersLaboratory } from 'src/orders_laboratory/entities/orders_laboratory.entity';
import { LabResults } from 'src/labResults/entities/labResults.entity';
import { OrdersDietary } from 'src/orders_dietary/entities/orders_dietary.entity';
import { OrdersDietaryService } from 'src/orders_dietary/orders_dietary.service';
import { CreateOrdersDietaryDto } from 'src/orders_dietary/dto/create-orders_dietary.dto';
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
    @InjectRepository(OrdersLaboratory)
    private ordersLaboratoryRepository: Repository<OrdersLaboratory>,

    private ordersDietaryService: OrdersDietaryService,
    private ordersLaboratoryService: OrdersLaboratoryService,
    private appointmentsService: AppointmentsService,
    private idService: IdService,
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<Orders> {
    const order = this.ordersRepository.create(createOrderDto);
    return await this.ordersRepository.save(order);
  }
  async findById(id: number): Promise<Orders> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID-${id} not found.`);
    }
    console.log(order, "orders id")
    return order;
  }

  async updateStatus(id: number, status: string): Promise<Orders> {
    const order = await this.findById(id);
    return await this.ordersRepository.save(order);
  }

  async createLab(appointmentUuid: string, patientUuid: string
  ): Promise<Orders> {
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ['id'],
      where: { uuid: patientUuid },
    });
    const appointmentId = await this.appointmentsService.findAppointmentIdByUuid(appointmentUuid);
    const orderDto = {
      uuid: this.idService.generateRandomUUID('ORD-'), appointmentId, patientId: patientId,
      orderDate: new Date().toISOString(), orderType: 'laboratory'
    };

    console.log(patientUuid, patientId, 'test')
    const savedOrder = await this.ordersRepository.save(orderDto);
    console.log(savedOrder, "saved order")  // Create the associated laboratory order
    console.log(savedOrder.id, "saved order ID ")  // Create the associated laboratory order
    const laboratoryOrderDto = {
      laboratoryId: null,
      orderId: savedOrder.id,
      patientId: patientId,

      // Optionally set initial status or any other default values here
      uuid: this.idService.generateRandomUUID('ORD-LAB-'),
      status: 'pending',
    };
    await this.ordersLaboratoryService.create(laboratoryOrderDto); // Use the OrdersPrescriptionsService

    return savedOrder; // Return the saved order
  }

  async createDietary(appointmentUuid: string, patientUuid: string, createOrdersDietaryDto: CreateOrdersDietaryDto
  ): Promise<Orders> {
    const { id: patientId } = await this.patientsRepository.findOne({
      select: ['id'],
      where: { uuid: patientUuid },
    });
    const appointmentId = await this.appointmentsService.findAppointmentIdByUuid(appointmentUuid);
    const orderDto = {
      uuid: this.idService.generateRandomUUID('ORD-'), appointmentId, patientId: patientId,
      orderDate: new Date().toISOString(), orderType: 'dietary'
    };

    console.log(patientUuid, patientId, 'test')
    const savedOrder = await this.ordersRepository.save(orderDto);
    console.log(savedOrder, "saved order")  // Create the associated laboratory order
    console.log(savedOrder.id, "saved order ID ")  // Create the associated laboratory order


    // Create the associated dietary order
    const dietaryOrderDto = {
      uuid: this.idService.generateRandomUUID('ORD-DTR-'),
      orderId: savedOrder.id,
      patientId: patientId,
      status: 'active', 
      ...createOrdersDietaryDto


    };
    Object.assign(dietaryOrderDto, createOrdersDietaryDto);

    await this.ordersDietaryService.create(dietaryOrderDto); // Pass the dietaryOrderDto to the create method

    return savedOrder; // Return the saved order
  }

  // Function to get orderId from orderUuid
  async getOrderIdFromUuid(orderUuid: string): Promise<number> {
    const order = await this.ordersRepository.findOne({
      select: ['id'],
      where: { uuid: orderUuid },
    });

    if (!order) {
      throw new NotFoundException(`Order with UUID ${orderUuid} not found`);
    }

    return order.id;
  }
  async getAllOrdersByPatient(
    patientUuid: string,
    orderType: string, // Add orderType as a parameter
    perPage: number = 4,
  ): Promise<{
    data: Orders[];
  }> {
    const patientExists = await this.patientsRepository.findOne({
      where: { uuid: patientUuid },
    });

    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }

    const ordersQueryBuilder = this.ordersRepository
      .createQueryBuilder('orders')
      .leftJoinAndSelect('orders.patient', 'patient')
      .select([
        'orders.uuid',
        'orders.appointmentId',
        'orders.orderDate',
        'orders.orderType',
      ])
      .where('patient.uuid = :uuid AND orders.orderType = :orderType ', {
        uuid: patientUuid,
        orderType, // Add orderType to the where clause
      });

    // Get prescriptions
    const orders = await ordersQueryBuilder.getRawMany();
    const totalPatientPrescriptions = await ordersQueryBuilder.getCount();
    const totalPages = Math.ceil(totalPatientPrescriptions / perPage);

    return {
      data: orders,
    };

  }
  async getPendingLabOrdersByPatient(
    patientUuid: string,
    // perPage: number = 4,
  ): Promise<{
    data: OrdersLaboratory[];
    // totalPages: number;
    // currentPage: number;
    // totalCount: number;
  }> {
    const patientExists = await this.patientsRepository.findOne({
      where: { uuid: patientUuid },
    });
  
    if (!patientExists) {
      throw new NotFoundException('Patient not found');
    }
  
    const ordersQueryBuilder = this.ordersLaboratoryRepository
      .createQueryBuilder('orders_laboratory')
      .innerJoin('orders_laboratory.order', 'orders')
      .innerJoin('orders.appointment', 'appointment')
      .innerJoin('orders.patient', 'patient')
      .select([
        'orders_laboratory.uuid AS laboratoryUuid',
        'orders.uuid AS orderUuid',
        'appointment.uuid AS appointmentUuid',
        'orders.orderDate AS dateIssued',
        'orders_laboratory.status AS status',
      ])
      .where('patient.uuid = :uuid AND orders_laboratory.status = :status', {
        uuid: patientUuid,
        status: 'pending',
      })
      .orderBy('orders_laboratory.id', 'ASC');
  
    const skip = 0; // You can calculate the skip value based on the page number
    // ordersQueryBuilder.offset(skip);
    // ordersQueryBuilder.limit(perPage);
  
    const orders = await ordersQueryBuilder.getRawMany();
    const totalOrders = await ordersQueryBuilder.getCount();
    // const totalPages = Math.ceil(totalOrders / perPage);
  
    return {
      data: orders,
      // totalPages,
      // currentPage: 1, // You can calculate the current page number
      // totalCount: totalOrders,
    };
  }
}
