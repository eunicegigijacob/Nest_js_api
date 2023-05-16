/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Wallet } from 'src/wallet/wallet.entity';
import { Repository } from 'typeorm';
import { Transaction } from './transactions.entity';
import { User } from 'src/users/users.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async generateTransactionReference(user: User): Promise<string> {
    const timestamp = new Date().getTime().toString();
    const usernamePrefix = user.firstName.substring(0, 3).toUpperCase();
    const reference = `${usernamePrefix}${timestamp}`;

    // Set the validity period for the transaction reference (15 minutes)
    const validityPeriod = 15 * 60 * 1000;
    const expirationTimestamp = new Date().getTime() + validityPeriod;

    // Update the user's wallet with the new reference and expiration time
    const updateWallet = await this.walletRepository.findOne({
      where: { user },
    });
    updateWallet.reference = {
      transactionRef: reference,
      referenceExpiration: expirationTimestamp,
    };
    await this.walletRepository.update(updateWallet.id, updateWallet);

    return reference;
  }

  async isTransactionRefUnique(
    user: User,
    reference: { transactionRef: string; referenceExpiration: number },
  ): Promise<boolean> {
    // Check if any user has the same transaction reference
    const existingUser = await this.walletRepository
      .createQueryBuilder('wallet')
      .innerJoin('wallet.user', 'user')
      .where('wallet.reference->>transactionRef = :transactionRef', {
        transactionRef: reference.transactionRef,
      })
      .andWhere('user.id != :userId', { userId: user.id })
      .getOne();

    console.log('this is unique', existingUser);

    return !existingUser; // Returns true if no user is found with the same transaction reference
  }
}
