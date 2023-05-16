/* eslint-disable prettier/prettier */
import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Wallet } from 'src/wallet/wallet.entity';

export class SignUpDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional()
  wallet: Wallet;
}
