/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CurrentUser } from 'src/auth/decorator/currentUser.decorator';
import { User } from 'src/users/users.entity';
import { FundWalletDto } from './dto/fundWallet.dto';
import { TransactionService } from 'src/transactions/transactions.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from './wallet.entity';
import { Repository } from 'typeorm';
import { Transaction } from 'src/transactions/transactions.entity';
import { JwtCookieAuthGuard } from 'src/auth/guard/user.guard';
import { error } from 'console';
import { DebitWalletDto } from './dto/debitWallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @Inject(TransactionService)
    private readonly transactionService: TransactionService,
    private readonly walletService: WalletService,
  ) {}

  @Get()
  async health(): Promise<any> {
    return 'serverUp';
  }

  @UseGuards(JwtCookieAuthGuard)
  @Post('fund')
  async fundWallet(
    @Body() fundWalletDto: FundWalletDto,
    @CurrentUser() user: User,
  ): Promise<any> {
    const { amount } = fundWalletDto;
    const wallet = await this.walletService.findWallet(user);

    console.log('wallet', typeof wallet.balance);

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    const isReferenceValid = this.walletService.isReferenceValid(
      user,
      wallet.reference,
    );

    if (!isReferenceValid) {
      this.transactionService.generateTransactionReference(user);
    }

    const isTransactionRefUnique =
      await this.walletService.isTransactionRefUnique(user, wallet.reference);

    if (!isTransactionRefUnique) {
      throw new ConflictException('Transaction reference already exists');
    }

    // Create new transaction
    const transaction = this.transactionRepository.create({
      amount,
      reference: wallet.reference.transactionRef,
      type: 'CREDIT',
    });

    transaction.wallet = wallet;
    await this.transactionRepository.save(transaction);

    // Update wallet balance
    wallet.balance += amount;

    wallet.transactions = [transaction];

    await this.walletRepository.save(wallet);

    return {
      status: 'succesfull',
    };
  }

  @UseGuards(JwtCookieAuthGuard)
  @Get('balance')
  async getBalance(@CurrentUser() user: User): Promise<number | any> {
    try {
      return await this.walletService.getWalletBalance(user);
    } catch (error) {
      return error;
    }
  }

  @UseGuards(JwtCookieAuthGuard)
  @Post('debit')
  async debitWallet(
    @Body() debitWalletDto: DebitWalletDto,
    @CurrentUser() user: User,
  ): Promise<void> {
    // Find the user's wallet
    const wallet = await this.walletService.findWallet(user);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Check if the requested debit amount is valid
    const amount = Number(debitWalletDto.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException('Invalid debit amount');
    }

    const reference =
      await this.transactionService.generateTransactionReference(user);
    // Calculate the new balance after debiting
    const newBalance = wallet.balance - amount;
    if (newBalance < 0) {
      throw new BadRequestException('Insufficient balance');
    }

    // Update the wallet balance
    wallet.balance = newBalance;
    await this.walletRepository.save(wallet);

    // Create a debit transaction
    const transaction = this.transactionRepository.create({
      reference,
      amount,
      type: 'DEBIT',
    });
    transaction.wallet = wallet;
    await this.transactionRepository.save(transaction);
  }
}
