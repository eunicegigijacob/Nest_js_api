import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Wallet } from 'src/wallet/wallet.entity';
import { WalletService } from 'src/wallet/wallet.service';
import { Transaction } from 'src/transactions/transactions.entity';
import { TransactionService } from 'src/transactions/transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Wallet, Transaction])],
  controllers: [UsersController],
  providers: [UsersService, WalletService, TransactionService],
})
export class UsersModule {}
