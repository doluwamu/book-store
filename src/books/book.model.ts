import * as mongoose from 'mongoose';

export const BookSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    publishDate: { type: Date, required: true },
    numOfPages: { type: Number },
  },
  { timestamps: true },
);

export interface Book extends mongoose.Document {
  id: string;
  name: string;
  author: string;
  publishDate: string;
  numOfPages: number;
}
