/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Wallet } from 'src/wallet/wallet.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  password: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @Column()
  @IsNotEmpty()
  @IsString()
  address: string;

  @Column({ default: 'USER' })
  @IsString()
  role: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user)
  wallet: Wallet;
}
