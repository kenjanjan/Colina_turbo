import { ObjectType } from '@nestjs/graphql';
import { Vaccination } from 'src/vaccination/entities/vaccination.entity';
import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('vaccinationFiles')
@ObjectType()
export class VaccinationFiles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(null, { nullable: true })
  file_uuid: string;

  @Column()
  vaccinationId: number;

  @Column()
  filename: string;

  @Column({
    type: 'bytea',
  })
  data: Uint8Array;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: string;

  @ManyToOne(() => Vaccination, (vacc) => vacc.vaccinationFile)
  @JoinColumn({
    name: 'vaccinationId', //fk id
  })
  vaccination: Vaccination | null;
}
