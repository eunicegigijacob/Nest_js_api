import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Req,
  Body,
} from '@nestjs/common';
import { JwtCookieAuthGuard } from '../auth/guard/user.guard';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { RoleGuard } from 'src/auth/guard/roles.guard';
import { Role } from 'src/auth/decorator/role.decorator';
import { Roles } from 'src/auth/enum/roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtCookieAuthGuard, RoleGuard)
  @Role(Roles.USER)
  @Get('/hello')
  async hello(@Request() req: any) {
    const id = req.user.payload['id'];
    const { password, ...result } = await this.usersService.findUserById(id);
    return result;
  }

  @UseGuards(JwtCookieAuthGuard, RoleGuard)
  @Role(Roles.USER)
  @Post('/update_user')
  @Role('USER')
  async updateUserAddress(
    @Req() req: any,
    @Body('address') address: string,
  ): Promise<object> {
    const id = req.user.payload['id'];
    const user = await this.usersService.updateUser(id, {
      address,
    });
    const { password, ...result } = user;

    return result;
  }

  @UseGuards(JwtCookieAuthGuard, RoleGuard)
  @Role(Roles.ADMIN)
  @Get('/all')
  async getAllUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }
}
