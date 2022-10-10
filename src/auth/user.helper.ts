import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { errorObj } from 'src/helpers/errorObj';

export const hashPassword = async (password: string, salt = 10) => {
  try {
    return await bcrypt.hash(password, salt);
  } catch (error) {
    throw new BadRequestException(errorObj(error));
  }
};

export const passwordsMatch = async (
  password: string,
  hashedPassword: string,
) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw new BadRequestException(errorObj(error));
  }
};

export const generateAccessToken = (id: string) => {
  return jwt.sign(
    {
      id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPRIE },
  );
};

export const generateRefreshToken = (id: string) => {
  return jwt.sign(
    {
      id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPRIE },
  );
};
