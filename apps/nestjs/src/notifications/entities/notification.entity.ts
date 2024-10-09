import { Appointments } from 'src/appointments/entities/appointments.entity';
import { MedicationLogs } from 'src/medicationLogs/entities/medicationLogs.entity';
import { UserNotification } from 'src/userNotifications/entities/user-notification.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('notifications')
export class Notification {
//   toJSON () {
//     delete this.id;
//     delete this.appointmentId;
//     delete this.medicationLogId;
//     delete this.updatedAt;
//     delete this.createdAt;
//     delete this.deletedAt;
//     return this;
// }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column({nullable: true})
  patientId: string;

  @Column()
  patientName: string;

  @Column()
  notificationType: string;

  @Column({ nullable: true })
  appointmentType: string;

  @Column({ nullable: true })
  medicationName: string;

  @Column({ nullable: true })
  medicationDosage: string;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column()
  details: string;

  @Column()
  status: string;

  @Column({ nullable: true })
  appointmentId: number;

  @Column({ nullable: true })
  medicationLogId: number;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: string;

  @OneToMany(() => UserNotification, (userNotification) => userNotification.notification)
  userNotifications: UserNotification[];

  @ManyToOne(() => Appointments, (appointment) => appointment.notifications, {
    nullable: true,
  })
  appointment: Appointments;

  @ManyToOne(
    () => MedicationLogs,
    (medicationLog) => medicationLog.notifications,
    { nullable: true },
  )
  medicationLog: MedicationLogs;
}
