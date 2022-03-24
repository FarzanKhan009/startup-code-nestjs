import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 30 })
  firstName: string;

  @Column({ length: 30 })
  lastName: string;

  @Column({ length: 50 })
  email: string;

  @Column({ length: 500 })
  password: string;

  @Column({ length: 10, default: '123456' })
  referralCode?: string;

  @Column({ length: 500, default: '1234' })
  token?: string;

  @Column({ length: 1000, default: '1234' })
  avatar?: string;

  @Column({ length: 500, default: '1234' })
  verificationHash: string;

  //referralCode
  @Column({ default: false })
  isEmaiVerified: boolean;

  //resetHash
  @Column({ length: 100, default: null })
  resetHash: string;
}
