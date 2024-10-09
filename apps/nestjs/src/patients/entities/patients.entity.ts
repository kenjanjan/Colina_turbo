import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Allergies } from 'src/allergies/entities/allergies.entity';
import { Appointments } from 'src/appointments/entities/appointments.entity';
import { Companies } from 'src/companies/entities/companies.entity';
import { EmergencyContacts } from 'src/emergencyContacts/entities/emergencyContacts.entity';
import { Forms } from 'src/forms/entities/form.entity';
import { LabResults } from 'src/labResults/entities/labResults.entity';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';

import { Notes } from 'src/notes/entities/notes.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { Surgeries } from 'src/surgeries/entities/surgeries.entity';
import { VitalSigns } from 'src/vitalSigns/entities/vitalSigns.entity';

import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { from } from 'rxjs';
import { PatientsProfileImage } from 'src/patientsProfileImage/entities/patientsProfileImage.entity';
import { Adl } from 'src/adls/entities/adl.entity';
import { Vaccination } from 'src/vaccination/entities/vaccination.entity';
import { Orders } from 'src/orders/entities/order.entity';

@Entity()
@ObjectType()
export class Patients {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  uuid: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  @Field((type) => Int)
  age: number;

  @Column({ nullable: true })
  email: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column()
  gender: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zip: string;

  @Column()
  @Field()
  country: string;

  @Column({ nullable: true })
  address1: string;

  @Column({ nullable: true })
  address2: string;

  @Column({ nullable: true })
  phoneNo: string;

  @Column({ type: 'date', nullable: true })
  admissionDate: Date;

  @Column({ nullable: true })
  codeStatus: string;

  @Column({ nullable: true })
  height: string;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  mobility: string;

  @Column({ nullable: true })
  dietaryRestrictions: string;

  @Column({ nullable: true })
  admissionStatus: string;

  @Column({ type: 'date', nullable: true })
  dischargeDate: Date;

  @Column({ type: 'date', nullable: true })
  reAdmissionDate: Date;

  @Column({ type: 'date', nullable: true })
  incidentReportDate: Date;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: string;

  //RELATIONAL FIELDS

  //Patient information to table medicationLogs
  @OneToMany(() => MedicationLogs, (medicationlogs) => medicationlogs.patient)
  @Field(() => [MedicationLogs], { nullable: true })
  medicationlogs: MedicationLogs[];

  //Patient information to table PRESCRIPTION
  @OneToMany(() => Prescriptions, (prescriptions) => prescriptions.patient)
  @Field(() => [Prescriptions], { nullable: true })
  prescriptions: Prescriptions[];

  //Patient information to table VitalSigns
  @OneToMany(() => VitalSigns, (vitalsign) => vitalsign.patient)
  @Field(() => [VitalSigns], { nullable: true })
  vitalsign: VitalSigns[];

  //Patient information to table LabResults
  @OneToMany(() => LabResults, (lab_results) => lab_results.patient)
  @Field(() => [LabResults], { nullable: true })
  lab_results: LabResults[];

  //Patient information to table Notes
  @OneToMany(() => Notes, (notes) => notes.patient)
  @Field(() => [Notes], { nullable: true })
  notes: Notes[];

  //Patient information to table Appointments
  @OneToMany(() => Appointments, (appointments) => appointments.patient)
  @Field(() => [Appointments], { nullable: true })
  appointments: Appointments[];

  //Patient information to table Emergency Contact
  @OneToMany(() => EmergencyContacts, (contact) => contact.patient)
  @Field(() => [EmergencyContacts], { nullable: true })
  contact: EmergencyContacts[];

  //Patient Information with FK patientId from Companies table
  @ManyToOne(() => Companies, (companies) => companies.patient)
  @JoinColumn({
    name: 'companyId',
  })
  companies: Companies;

  //Patient information to table Allergies
  @OneToMany(() => Allergies, (allergies) => allergies.patient)
  allergies: Allergies[];

  //Patient information to table Allergies
  @OneToMany(() => Surgeries, (surgeries) => surgeries.patient)
  surgeries: Surgeries[];

  //Patient information to table Forms
  @OneToMany(() => Forms, (forms) => forms.patient)
  @Field(() => [Forms], { nullable: true })
  forms: Forms[];

  @OneToMany(() => PatientsProfileImage, (img) => img.patients)
  @JoinColumn({ name: 'id' }) // Specify the column name for the primary key
  patientProfileImage?: PatientsProfileImage;

  @OneToMany(() => Adl, (adl) => adl.patient)
  @Field(() => [Adl], { nullable: true })
  adl: Adl[];

  @OneToMany(() => Vaccination, (vaccination) => vaccination.patient)
  @Field(() => [Vaccination], { nullable: true })
  vaccination: Vaccination[];
  @OneToMany(() => Orders, (order) => order.patient)
  @Field(() => [Orders], { nullable: true })
  order: Orders[];
}
