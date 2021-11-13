import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Owner extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string; // 유저 이름

  @Column({ unique: true })
  phone: string; // 휴대폰 번호 & ID로 사용

  @Column({ default: false })
  phone_verified: boolean; // 번호 인증 여부

  @Column({ nullable: true })
  temp_code: string; // 번호 인증시 사용할 임시 코드

  @Column()
  password: string;

  @Column()
  salt_key: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ default: false })
  is_blocked: boolean;
}
