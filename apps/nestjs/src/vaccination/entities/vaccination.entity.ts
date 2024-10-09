import { Patients } from 'src/patients/entities/patients.entity';
import {  VaccinationFiles } from 'src/vaccination-files/entities/vaccination-file.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('vaccination')
export class Vaccination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  vaccinatorName: string;

  @Column()
  vaccineManufacturer: string;

  @Column()
  healthFacility: string;

  @Column({ nullable: true })
  dosageSequence: string;

  @Column({ nullable: true })
  dateIssued: string;

  @Column({ nullable: true })
  patientId: number;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: string;

  //vaccination Table with FK patientId from Patients table
  @ManyToOne(() => Patients, (patient) => patient.vaccination)
  @JoinColumn({
    name: 'patientId',
  })
  patient: Patients;
 
  @OneToMany(() => VaccinationFiles, (file) => file.vaccination)
  @JoinColumn({ name: 'id' }) // Specify the column name for the primary key
  vaccinationFile?: VaccinationFiles; 
}
