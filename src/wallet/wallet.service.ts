/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/transactions/transactions.entity';
import { User } from 'src/users/users.entity';
import { Not, Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { CreateWalletDTO } from './dto/createWallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) {}
  async createWallet(createWalletDto: CreateWalletDTO): Promise<any> {
    console.log(createWalletDto);
    const wallet = this.walletRepository.create(createWalletDto);
    const result = this.walletRepository.save(wallet);
    return result;
  }

  async findWallet(user: User): Promise<Wallet> {
    return await this.walletRepository.findOne({ where: { user } });
  }

  async getWalletBalance(user: User): Promise<number> {
    const wallet = await this.findWallet(user);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet.balance;
  }

  async isReferenceValid(
    user: User,
    reference: { transactionRef: string; referenceExpiration: number },
  ): Promise<boolean> {
    const currentTimestamp = new Date().getTime();
    if (reference.referenceExpiration < currentTimestamp) {
      return false; // Reference has expired
    }

    return true; // Reference is valid
  }

  async isTransactionRefUnique(
    user: User,
    reference: { transactionRef: string; referenceExpiration: number },
  ): Promise<boolean> {
    const transactionRefJson = JSON.stringify(reference);
    const existingUser = await this.walletRepository
      .createQueryBuilder('wallet')
      .where('wallet.user != :userId', { userId: user.id })
      .andWhere('wallet.reference @> :reference ', {
        reference: transactionRefJson,
      })
      .getOne();

    return !existingUser; // Returns true if no user is found with the same transaction reference
  }
}
