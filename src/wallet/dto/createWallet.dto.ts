/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transaction } from 'src/transactions/transactions.entity';
import { User } from 'src/users/users.entity';

/* eslint-disable prettier/prettier */
export class CreateWalletDTO {
  @IsOptional()
  @IsNumber()
  balance: number;

  @IsOptional()
  @IsString()
  tansactionRef?: string;

  @IsNotEmpty()
  user: User;

  transactions: Transaction[];
}
