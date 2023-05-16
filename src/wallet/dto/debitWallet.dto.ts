/* eslint-disable prettier/prettier */
import { IsNumber, Min } from 'class-validator';

export class DebitWalletDto {
  @IsNumber()
  @Min(0)
  amount: number;
}
