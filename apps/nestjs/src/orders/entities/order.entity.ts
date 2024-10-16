import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { OrdersDietary } from 'src/orders_dietary/entities/orders_dietary.entity';
import { OrdersLaboratory } from 'src/orders_laboratory/entities/orders_laboratory.entity';
import { OrdersPrescriptions } from 'src/orders_prescriptions/entities/orders_prescription.entity';
import { Patients } from 'src/patients/entities/patients.entity';

import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Orders {
    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id: number;

    @Column()
    @Field()
    uuid: string;

    @Column()
    @Field()
    appointmentId: number;

    @Column()
    @Field()
    orderDate: string;

    @Column()
    orderType: string

   

    @Column({ nullable: true })
    @Field()
    patientId: number;

    @UpdateDateColumn({ nullable: true })
    @Field()
    updatedAt: string;

    @CreateDateColumn({ nullable: true })
    @Field()
    createdAt: string;

    @DeleteDateColumn({ nullable: true })
    @Field()
    deletedAt: string;

    //Orders Table with FK patientId from appointment table
    @ManyToOne(() => Appointments, (appointment) => appointment.order)
    @JoinColumn({
        name: 'appointmentId',
    })
    appointment: Appointments;


    @OneToOne(() => OrdersPrescriptions, (order_prescription) => order_prescription.order)
    order_prescription?: OrdersPrescriptions;

    @OneToOne(() => OrdersLaboratory, (order_laboratory) => order_laboratory.order)
    order_laboratory?: OrdersLaboratory;

    @OneToOne(() => OrdersDietary, (orders_dietary) => orders_dietary.order)
    orders_dietary?: OrdersDietary;
   @ManyToOne(() => Patients, (patient) => patient.order)
    @JoinColumn({
        name: 'patientId',
    })
    patient: Patients;


}
