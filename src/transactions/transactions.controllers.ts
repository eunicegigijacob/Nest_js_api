/* eslint-disable prettier/prettier */
import {
  Body,
  ConflictException,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { User } from 'src/users/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from './transactions.entity';
import { Repository } from 'typeorm';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { FundWalletDto } from 'src/wallet/dto/fundWallet.dto';
import { WalletService } from 'src/wallet/wallet.service';
import { Wallet } from 'src/wallet/wallet.entity';
import { JwtCookieAuthGuard } from 'src/auth/guard/user.guard';
import { Role } from 'src/auth/decorator/role.decorator';
import { Roles } from 'src/auth/enum/roles.enum';
import { RoleGuard } from 'src/auth/guard/roles.guard';

@Controller('transaction')
export class TransactionController {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @Inject(WalletService)
    private readonly walletService: WalletService,
    private readonly transactionService: TransactionService,
  ) {}

  @UseGuards(JwtCookieAuthGuard)
  @Get('generate-transaction-ref')
  async generateRef(@CurrentUser() user: User): Promise<string> {
    return await this.transactionService.generateTransactionReference(user);
  }

  @UseGuards(JwtCookieAuthGuard)
  @Get('user')
  async getUserTransactions(@CurrentUser() user: User): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.find({
      where: { wallet: { user } },
      relations: ['wallet'],
    });
    return transactions;
  }

  @UseGuards(JwtCookieAuthGuard, RoleGuard)
  @Role(Roles.ADMIN)
  @Get('/all-transactions')
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions();
  }
}
