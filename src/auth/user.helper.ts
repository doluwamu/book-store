import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

export const hashPassword = async (password: string, salt = 10) => {
  try {
    return await bcrypt.hash(password, salt);
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
};
