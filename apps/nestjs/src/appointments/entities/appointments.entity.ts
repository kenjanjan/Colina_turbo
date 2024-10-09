import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Patients } from 'src/patients/entities/patients.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AppointmentsFiles } from 'src/appointmentsFiles/entities/appointmentsFiles.entity';
import {  Orders } from 'src/orders/entities/order.entity';

@Entity()
@ObjectType()
export class Appointments {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  uuid: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateCreated: Date;

  @Column({nullable:true})
  appointmentDate: string;

  @Column({nullable:true})
  appointmentTime: string;

  @Column({nullable:true})
  appointmentEndTime: string;

  @Column({nullable:true})
  appointmentType: string;

  @Column({nullable:true})
  appointmentDoctor: string;

  @Column({nullable:true})
  details: string;

  @Column({nullable:true})
  appointmentStatus: string;

  @Column({nullable:true})
  rescheduleReason: string;

  @Column()
  @Field((type) => Int)
  patientId: number;
  
  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: string;

  //Appointments Table with FK patientId from Patients table
  @ManyToOne(() => Patients, (patient) => patient.appointments)
  @JoinColumn({
    name: 'patientId',
  })
  patient: Patients;

  @OneToMany(() => Notification, (notification) => notification.appointment)
  notifications: Notification[];

  @OneToMany(() => AppointmentsFiles, (file) => file.appointment)
  @JoinColumn({ name: 'id' }) // Specify the column name for the primary key
  appointmentsFiles?: AppointmentsFiles;


  @OneToMany(() => Orders, (order) => order.appointment)
  @JoinColumn({ name: 'id' }) // Specify the column name for the primary key
  order?: Orders;
}
