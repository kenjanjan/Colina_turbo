import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { Orders } from 'src/orders/entities/order.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { OneToOne } from 'typeorm';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class OrdersDietary {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  uuid: string;

  @Column()
  @Field()
  orderId: number;

  @Column()
  @Field()
  patientId: number;

  @Column({ nullable: true })
  @Field()
  notes: string;

  @Column({ nullable: true })
  @Field()
  dietary: string;
  
  @Column({ nullable: true })
  @Field()
  status: string;


  //orderdate will be from orders table which is orderdate and is from appointment date after the apt

  @UpdateDateColumn({ nullable: true })
  @Field()
  updatedAt: string;

  @CreateDateColumn({ nullable: true })
  @Field()
  createdAt: string;

  @DeleteDateColumn({ nullable: true })
  @Field()
  deletedAt: string;


  @OneToOne(() => Orders, (order) => order.orders_dietary)
  @JoinColumn({ name: 'orderId' })
  order?: Orders;
}
