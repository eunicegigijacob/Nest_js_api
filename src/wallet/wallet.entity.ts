/* eslint-disable prettier/prettier */
import { Transaction } from 'src/transactions/transactions.entity';
import { User } from 'src/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float', default: 0 })
  balance: number;

  @Column({ unique: true, nullable: true, type: 'jsonb' })
  reference: {
    transactionRef: string;
    referenceExpiration: number;
  };

  @OneToOne(() => User, (user) => user.wallet, { cascade: true })
  @JoinColumn()
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.wallet, {
    nullable: true,
  })
  transactions: Transaction[];
}
