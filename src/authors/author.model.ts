import * as mongoose from 'mongoose';

export const AuthorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    DOB: { type: Date, required: true },
    age: { type: Number },
    numOfBooks: { type: Number, required: true, default: 0 },
    biography: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

export interface Author extends mongoose.Document {
  id: string;
  name: string;
  DOB: string;
  age: number;
  numOfBooks: number;
  biography: string;
}
