/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { User } from 'src/users/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/transactions/transactions.entity';
import { Wallet } from './wallet.entity';
import { TransactionService } from 'src/transactions/transactions.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction, Wallet])],
  controllers: [WalletController],
  providers: [WalletService, TransactionService, UsersService],
})
export class WalletModule {}
