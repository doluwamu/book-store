import * as mongoose from 'mongoose';

export const BookSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
      default:
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
    },
    name: { type: String, required: true, lowercase: true },
    author: { type: String, required: true },
    category: { type: String, required: true, default: 'Action' },
    publishDate: { type: Date, required: true },
    numOfPages: { type: Number, default: 0 },
    preface: { type: String, required: true },
    link: { type: String, required: true },
  },
  { timestamps: true },
);

export interface Book extends mongoose.Document {
  id: string;
  image: string;
  name: string;
  author: string;
  category: string;
  publishDate: string;
  numOfPages: number;
  preface: string;
  link: string;
}
