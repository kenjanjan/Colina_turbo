import { CreateOrdersDietaryDto } from './dto/create-orders_dietary.dto';
import { UpdateOrdersDietaryDto } from './dto/update-orders_dietary.dto';
import { OrdersDietary } from './entities/orders_dietary.entity';
import {
  Brackets,
  Repository,
  EntityManager,
} from 'typeorm';
import { InjectRepository, } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Orders } from 'src/orders/entities/order.entity';

interface RawOrderDietary {
  ordersDietaryUuid: string;
  orderUuid: string;
  orderType: string;
  appointmentUuid: string;
  dateIssued: Date; // or string, depending on how you handle dates
  status: string;
  patientUuid: string;
  dietary: string;
  notes: string;
 
}

@Injectable()
export class OrdersDietaryService {
  constructor(
    @InjectRepository(OrdersDietary)
    private readonly OrdersDietaryRepository: Repository<OrdersDietary>,
    @InjectRepository(Orders)
    private readonly ordersRepository: Repository<Orders>,

  ) { }

  async create(CreateOrdersDietaryDto: CreateOrdersDietaryDto): Promise<OrdersDietary> {
    const orderLaboratory = this.OrdersDietaryRepository.create({
      ...CreateOrdersDietaryDto,
    });
    return await this.OrdersDietaryRepository.save(orderLaboratory);
  }
  async updateOrdersDietary(orderUuid: string, updateOrdersDietaryDto: UpdateOrdersDietaryDto ): Promise<OrdersDietary> {
    const { ...updateData } = updateOrdersDietaryDto;
    const { id: orderId } = await this.ordersRepository.findOne({
      select: ['id'],
      where: { uuid: orderUuid },
    });

    const orderDietary = await this.OrdersDietaryRepository.findOne({
      where: { orderId:orderId },
    });
    console.log(orderDietary, "orderlaboratory")
    if (!orderDietary) {
      throw new NotFoundException(`OrderLaboratory with orderId ${orderUuid} not found`);
    }
    Object.assign(orderDietary, updateData);

    return await this.OrdersDietaryRepository.save(orderDietary);
  }
  async findDietaryOrdersByPatientUuid(
    patientUuid: string,
    term: string = '',
    filterStatus: string[] = [],
    sortBy: string = 'dateIssued', // Set default value for sortBy
    sortOrder: 'ASC' | 'DESC' = 'ASC',
    page: number = 1,
    perPage: number = 4
  ): Promise<{
    data: RawOrderDietary[]; // Use the new type here
    totalPages: number;
    currentPage: number;
    totalCount: number;
  }> {
    const skip = (page - 1) * perPage;
    const searchTerm = `%${term}%`;
  
    const dietaryOrdersQueryBuilder = this.OrdersDietaryRepository
      .createQueryBuilder('orders_dietary')
      .select([
        'orders_dietary.uuid AS dietaryUuid',
        'orders.uuid AS orderUuid',
        'orders_dietary.dietary AS dietary',
        'orders_dietary.notes AS notes',
        'appointment.uuid AS appointmentUuid',
        'orders.orderDate AS dateIssued',
        'orders_dietary.status AS status',
      ])
      .innerJoin('orders_dietary.order', 'orders')
      .innerJoin('orders.appointment', 'appointment')
      .innerJoin('orders.patient', 'patient')
      .where('patient.uuid = :patientUuid', { patientUuid })
      .orderBy(`${sortBy}`, sortOrder)
      .offset(skip)
      .limit(perPage);
  
    // Apply filterStatus if provided
    if (filterStatus.length > 0) {
      dietaryOrdersQueryBuilder.andWhere(
        'orders_dietary.status IN (:...filterStatus)',
        { filterStatus }
      );
    }
  
    // Apply search term if provided
    if (term) {
      dietaryOrdersQueryBuilder.andWhere(
        new Brackets((qb) => {
          qb.andWhere('order.uuid ILIKE :searchTerm', { searchTerm })
            .orWhere('orders.dateIssued::text ILIKE :searchTerm', { searchTerm });
        })
      );
    }
  
    // Get the total count before applying pagination
    const totalCount = await dietaryOrdersQueryBuilder.getCount();
  
    // Apply pagination
    const dietaryOrders: RawOrderDietary[] = await dietaryOrdersQueryBuilder
      .getRawMany();
  
    const totalPages = Math.ceil(totalCount / perPage); // Calculate total pages
  
    return {
      data: dietaryOrders,
      totalPages,
      currentPage: page,
      totalCount,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} ordersDietary`;
  }

  update(id: number, updateOrdersDietaryDto: UpdateOrdersDietaryDto) {
    return `This action updates a #${id} ordersDietary`;
  }

  remove(id: number) {
    return `This action removes a #${id} ordersDietary`;
  }
}
