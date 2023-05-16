import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
// import { jwtConstants } from './jwt.constants';
import { config } from 'dotenv';
import { Wallet } from 'src/wallet/wallet.entity';
import { WalletService } from 'src/wallet/wallet.service';
import { Transaction } from 'src/transactions/transactions.entity';
import { TransactionService } from 'src/transactions/transactions.service';
config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Wallet, Transaction]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRETE,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, WalletService, TransactionService],
})
export class AuthModule {}
