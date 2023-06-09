/* eslint-disable prettier/prettier */

import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtCookieAuthGuard implements CanActivate {
  constructor(
    @Inject(UsersService)
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.cookies['jwt']) {
      throw new UnauthorizedException('You must be authenticated');
    }
    const token = request.cookies['jwt'];
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: 'thisismysecretekey',
      });

      request['user'] = this.userService.findUserById(payload.id);
      request['payload'] = payload;
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
