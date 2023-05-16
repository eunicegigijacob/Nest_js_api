/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TransactionController } from './transactions.controllers';
import { TransactionService } from './transactions.service';
import { User } from 'src/users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from 'src/wallet/wallet.entity';
import { Transaction } from './transactions.entity';
import { WalletService } from 'src/wallet/wallet.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet, Transaction])],
  controllers: [TransactionController],
  providers: [TransactionService, WalletService, UsersService],
})
export class TransactionsModule {}
