import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Orders } from 'src/orders/entities/order.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class OrdersPrescriptions {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  uuid: string;

  @Column()
  @Field(() => Int)
  prescriptionId: number;

  @Column()
  @Field(() => Int)
  orderId: number;

  @Column({ nullable: true })
  @Field()
  status: string;

  @UpdateDateColumn({ nullable: true })
  @Field()
  updatedAt: string;

  @CreateDateColumn({ nullable: true })
  @Field()
  createdAt: string;

  @DeleteDateColumn({ nullable: true })
  @Field()
  deletedAt: string;

  @OneToOne(() => Prescriptions, (prescription) => prescription.order_prescription)
  @JoinColumn({ name: 'prescriptionId' })
  prescription?: Prescriptions;

  @OneToOne(() => Orders, (order) => order.order_prescription)
  @JoinColumn({ name: 'orderId' })
  order?: Orders;
}
