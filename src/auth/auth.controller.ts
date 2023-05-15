import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get()
  health() {
    return 'server Up!';
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  async signUp(@Body() signUpDTO: SignUpDTO): Promise<object> {
    return this.authService.signUp(signUpDTO);
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(
    @Body() loginDTO: LoginDTO,
    @Res({ passthrough: true }) response: Response,
  ): Promise<any> {
    const token = await this.authService.login(loginDTO);
    response.cookie('jwt', token, { httpOnly: true });
    return {
      success: true,
      message: 'sucessful login',
    };
  }
}
