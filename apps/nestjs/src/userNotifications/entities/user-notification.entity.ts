import { Users } from 'src/users/entities/users.entity';
import { Notification } from 'src/notifications/entities/notification.entity';
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

@Entity('user_notifications')
export class UserNotification {
  // toJSON() {
  //   delete this.id;
  //   delete this.userId;
  //   delete this.notificationId;
  //   delete this.updatedAt;
  //   delete this.createdAt;
  //   delete this.deletedAt;
  //   return this;
  // }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  userId: number;

  @Column()
  notificationId: number;

  @Column()
  is_read: boolean;

  @UpdateDateColumn({ name: 'updatedAt', nullable: true })
  updatedAt: string;

  @CreateDateColumn({ name: 'createdAt', nullable: true })
  createdAt: string;

  @DeleteDateColumn({ name: 'deletedAt', nullable: true })
  deletedAt: string;

  @ManyToOne(() => Users, (user) => user.userNotifications)
  user: Users;

  @ManyToOne(
    () => Notification,
    (notification) => notification.userNotifications,
  )
  notification: Notification;
}
