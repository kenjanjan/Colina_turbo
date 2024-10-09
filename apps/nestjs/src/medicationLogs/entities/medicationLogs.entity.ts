import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Patients } from 'src/patients/entities/patients.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
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

@Entity('medicationLogs')
@ObjectType()
export class MedicationLogs {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column({ nullable: true })
  uuid: string;

  @Column()
  medicationLogsName: string;

  @Column({nullable: true})
  medicationLogsDosage: string;

  @Column()
  medicationLogsDate: string;

  @Column()
  @Field()
  medicationLogsTime: string;

  @Column({ nullable: true })
  notes: string;

  @Column({ nullable: true })
  hasDuration: string;

  @Column({ nullable: true })
  @Field(() => Int)
  patientId: number;

  @Column({ nullable: true })
  @Field(() => Int)
  prescriptionId: number;

  @Column({ nullable: true })
  medicationType: string;

  @Column({ nullable: true })
  medicationLogStatus: string;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  @Field()
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  @Field()
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  @Field()
  deletedAt: string;

  //MedicationLogs Table with FK patientId from Patients table
  @ManyToOne(() => Patients, (patient) => patient.medicationlogs)
  @JoinColumn({
    name: 'patientId',
  })
  patient: Patients;

  @ManyToOne(() => Prescriptions, (prescription) => prescription.medicationlogs)
  @JoinColumn({
    name: 'prescriptionId',
  })
  prescription: Prescriptions;
  // // Foreign key reference to the Prescriptions entity
  // @ManyToOne(() => Prescriptions)
  // @JoinColumn({ name: 'prescriptionsId', referencedColumnName: 'id' }) // FK attribute
  // prescriptions: Prescriptions;

  @OneToMany(() => Notification, (notification) => notification.medicationLog)
  notifications: Notification[];
}
