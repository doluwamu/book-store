import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async userRegister(userInfo: {
    username: string;
    email: string;
    role: string;
    password: string;
  }) {
    try {
      const existingUser = await this.userModel.findOne({
        email: userInfo.email,
      });

      if (existingUser) {
        const errObj: {
          message: string;
        } = {
          message: 'User already exists!',
        };
        throw new BadRequestException(errObj);
      }

      const hashPassword = await bcrypt.hash(userInfo.password, 10);

      const newUser = new this.userModel({
        username: userInfo.username,
        email: userInfo.email,
        role: userInfo.role,
        password: hashPassword,
      });

      await newUser.save();
      return { message: 'Registration successful', id: newUser.id };
    } catch (error) {
      const errObj: {
        name: string;
        message: string;
      } = {
        name: error.name,
        message: error.message,
      };
      throw new BadRequestException(errObj);
    }
  }
}
