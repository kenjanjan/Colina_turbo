import { Appointments } from 'src/appointments/entities/appointments.entity';
import { Prescriptions } from 'src/prescriptions/entities/prescriptions.entity';
import { Column,  CreateDateColumn, UpdateDateColumn,
  DeleteDateColumn,Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('appointmentsFiles')
export class AppointmentsFiles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column(null, { nullable: true })
  file_uuid: string;  

  @Column() 
  appointmentsId: number;

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
  @ManyToOne(
    () => Appointments,
    (appointment) => appointment.appointmentsFiles,
  )
  @JoinColumn({
    name: 'appointmentsId', //fk id
  })
  appointment: Appointments | null;
}

