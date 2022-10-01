import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './book.model';

@Injectable()
export class BookService {
  constructor(@InjectModel('Book') private readonly bookModel: Model<Book>) {}

  createBook = async (
    name: string,
    author: string,
    publishDate: string,
    numOfPages: number,
  ) => {
    try {
      const newBook = new this.bookModel({
        name,
        author,
        publishDate,
        numOfPages,
      });

      const result = await newBook.save();
      return { message: 'Book added successfully', id: result.id };
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

  listBooks = async () => {
    try {
      const books = await this.bookModel.find({});
      return books.map((book) => ({
        id: book.id,
        name: book.name,
        author: book.author,
        publishDate: book.publishDate,
        numOfPages: book.numOfPages,
      }));
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

  getBook = async (bookId: string) => {
    const book = await this.findBook(bookId);
    return {
      id: book.id,
      name: book.name,
      author: book.author,
      publishDate: book.publishDate,
      numOfPages: book.numOfPages,
    };
  };

  editBook = async (
    bookId: string,
    bookData: {
      name: string;
      author: string;
      publishDate: string;
      numOfPages: number;
    },
  ) => {
    const book = await this.findBook(bookId);

    book.name = bookData.name ? bookData.name : book.name;
    book.author = bookData.author ? bookData.author : book.author;
    book.publishDate = bookData.publishDate
      ? bookData.publishDate
      : book.publishDate;
    book.numOfPages = bookData.numOfPages
      ? bookData.numOfPages
      : book.numOfPages;

    await book.save();
    return { response: { message: 'Book data updated successsfully' } };
  };

  deleteBook = async (bookId: string) => {
    const book = await this.findBook(bookId);

    await book.remove();
    return { response: { message: 'Book deleted successsfully' } };
  };

  private findBook = async (id: string) => {
    try {
      const book = await this.bookModel.findById(id).exec();

      if (!book) throw new NotFoundException('Book not found');

      return book;
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
}
