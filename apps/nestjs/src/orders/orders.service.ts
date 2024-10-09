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
@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private ordersRepository: Repository<Orders>,
    @InjectRepository(Patients)
    private patientsRepository: Repository<Patients>,
    @InjectRepository(OrdersLaboratory)
    private ordersLaboratoryRepository: Repository<OrdersLaboratory>,
   
    private ordersLaboratoryService: OrdersLaboratoryService,
    private appointmentsService: AppointmentsService,
    private idService: IdService,
  ) { }

  async create(createOrderDto: CreateOrderDto): Promise<Orders> {
    const order = this.ordersRepository.create(createOrderDto);
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
      patientId:patientId,

      // Optionally set initial status or any other default values here
      uuid: this.idService.generateRandomUUID('ORD-LAB-'),
      status: 'pending',
    };
    await this.ordersLaboratoryService.create(laboratoryOrderDto); // Use the OrdersPrescriptionsService

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

}
