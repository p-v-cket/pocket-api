import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Owner } from '../../owner/owner.entity';
import { EntryLog } from '../entry_log/entry_log.entity';

@Entity()
export class Store extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string; // 가게 이름

  @Column()
  location: string; // 장소

  @Column({ unique: true })
  business_number: string; // 사업자번호

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  owner_uuid: string;

  @ManyToOne(() => Owner, (owner) => owner.stores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_uuid' })
  owner: Owner;

  @OneToMany(() => EntryLog, (entryLog) => entryLog.store)
  entry_logs: EntryLog[];
}
