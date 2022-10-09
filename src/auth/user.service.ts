import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { errorObj } from 'src/helpers/errorObj';
import { hashPassword } from './user.helper';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  userRegister = async (userInfo: {
    username: string;
    email: string;
    role: string;
    password: string;
  }) => {
    try {
      const existingUser = await this.userModel.findOne({
        email: userInfo.email,
      });

      if (existingUser) {
        const err: {
          name: string;
          message: string;
        } = {
          name: 'error',
          message: 'User already exists!!!',
        };
        throw new BadRequestException(errorObj(err));
      }

      const hashedPassword = await hashPassword(userInfo.password);

      const newUser = new this.userModel({
        username: userInfo.username,
        email: userInfo.email,
        role: userInfo.role,
        password: hashedPassword,
      });

      await newUser.save();
      return { message: 'Registration successful', id: newUser.id };
    } catch (error) {
      throw new BadRequestException(errorObj(error));
    }
  };

  listUsers = async () => {
    try {
      const users = await this.userModel.find({});

      return users.map((user) => {
        return this.userInformation(user);
      });
    } catch (error) {
      throw new BadRequestException(errorObj(error));
    }
  };

  private userInformation = (user: User & { _id: Types.ObjectId }) => {
    return {
      id: user.id,
      name: user.username,
      email: user.email,
      role: user.role,
    };
  };
}
