import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignUpDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService)
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDTO: SignUpDTO): Promise<object> {
    let status: object = {
      success: true,
      message: 'SignUp sucessful',
    };

    try {
      await this.usersService.createUser(signUpDTO);
    } catch (error) {
      console.log(error);
      status = {
        success: false,
        message: error.message,
      };
    }
    return status;
  }

  async login(loginDTO: LoginDTO): Promise<any> {
    const payload = await this.usersService.userLogin(loginDTO);

    return this.jwtService.sign(payload);
  }
}
