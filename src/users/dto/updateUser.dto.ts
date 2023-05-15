/* eslint-disable prettier/prettier */
import { IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  address: string;
}
