import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/api/v1/users/')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async registerUser(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('role') role: string,
    @Body('password') password: string,
    @Body('confirmationPassword') confirmationPassword: string,
  ) {
    if (!username) throw new NotFoundException('username is a required field!');
    if (!email) throw new NotFoundException('email is a required field!');
    if (!role) throw new NotFoundException('role is a required field!');
    if (!password) throw new NotFoundException('password is a required field!');
    if (!confirmationPassword)
      throw new NotFoundException('confirmation password is a required field!');

    if (password !== confirmationPassword)
      throw new NotFoundException("passwords don't match");

    const userDataInfo = await this.userService.userRegister({
      username,
      email,
      role,
      password,
    });
    return userDataInfo;
  }

  @Get()
  async getUsers() {
    const users = await this.userService.listUsers();
    return users;
  }
}
