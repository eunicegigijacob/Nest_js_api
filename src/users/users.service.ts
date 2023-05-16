import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { SignUpDTO } from 'src/auth/dto/signup.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { Wallet } from 'src/wallet/wallet.entity';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private jwtService: JwtService,
    @Inject(WalletService)
    private walletService: WalletService,
  ) {}

  async createUser(signUpDTO: SignUpDTO): Promise<any> {
    const { email, password, firstName, lastName, address, role } = signUpDTO;
    const existingUser = await this.findUserByEmail(email);

    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hashedPassword = await bcrypt.hash(password, +process.env.HASH_SALT);

    const user = this.userRepository.create({
      firstName,
      lastName,
      address,
      role,
      email,
      password: hashedPassword, // Save the hashed password
    });

    await this.userRepository.save(user);

    //create wallet for user
    const wallet = await this.walletService.createWallet({
      balance: parseInt('0'),
      user,
      tansactionRef: '',
      transactions: [],
    });
    return [user, wallet];
  }

  async findUserById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async findUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async userLogin(loginDTO: LoginDTO): Promise<object> {
    const { email, password } = loginDTO;

    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return {
      payload: {
        id: user.id,
        role: user.role,
      },
    };
  }

  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDTO,
  ): Promise<User | null> {
    const { address } = updateUserDto;

    const result = await this.userRepository.update(id, { address });

    if (result.affected === 0) {
      return null;
    }

    return await this.findUserById(id);
  }
}
