import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { LabResults } from 'src/labResults/entities/labResults.entity';
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
export class OrdersLaboratory {
    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id: number;

    @Column()
    @Field()
    uuid: string;

    @Field()
    @Column({nullable:true})
    laboratoryId: number;

    @Column()
    @Field()
    orderId: number;
    @Column({nullable:true})
    @Field()
    patientId: number;


    @Column()
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

    @OneToOne(() => LabResults, (lab) => lab.order_laboratory)
    @JoinColumn({ name: 'laboratoryId' })
    lab?: LabResults;
  
    @OneToOne(() => Orders, (order) => order.order_laboratory)
    @JoinColumn({ name: 'orderId' })
    order?: Orders;
}