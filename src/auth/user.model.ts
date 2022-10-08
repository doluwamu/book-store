import * as mongoose from 'mongoose';
import validator from 'validator';

export const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, lowercase: true },
    email: {
      type: String,
      requied: true,
      unique: true,
      trim: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    role: { type: String, required: true },
    password: {
      type: String,
      required: true,
      select: false,
      minlength: [8, 'Password must be at least 8 characters!'],
    },
  },
  {
    timestamps: true,
  },
);

export interface User extends mongoose.Document {
  username: string;
  email: string;
  role: string;
  password: string;
}
