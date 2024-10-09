import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Patients } from 'src/patients/entities/patients.entity';

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

@Entity('emergencyContacts')
@ObjectType()
export class EmergencyContacts {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  uuid: string;

  @Column({nullable : true})
  @Field()
  name: string;

  @Column({nullable : true})
  @Field()
  email: string;

  @Column()
  @Field()
  phoneNumber: string;

  @Column()
  @Field()
  patientRelationship: string;

  @Column()
  @Field((type) => Int)
  patientId: number;
  
  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  @Field()
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  @Field()
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  @Field()
  deletedAt: string;


  //Emergency Contact Table with FK patientId from Patients table
  @ManyToOne(() => Patients, (patient) => patient.contact)
  @JoinColumn({
    name: 'patientId',
  })
  patient: Patients;
}
