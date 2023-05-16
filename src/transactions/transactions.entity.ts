/* eslint-disable prettier/prettier */
import { Wallet } from 'src/wallet/wallet.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column()
  reference: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column()
  type: string;

  @ManyToOne(() => Wallet, (wallet) => wallet.transactions)
  wallet: Wallet;
}
