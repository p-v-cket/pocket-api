import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/user.entity';
import { Store } from '../store/store.entity';

@Entity()
export class EntryLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  user_uuid: string;

  @ManyToOne(() => User, (user) => user.entry_logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_uuid' })
  user: User;

  @Column()
  store_uuid: string;

  @ManyToOne(() => Store, (store) => store.entry_logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_uuid' })
  store: Store;
}
