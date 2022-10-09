import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { errorObj } from 'src/helpers/errorObj';
import { Book } from './book.model';

@Injectable()
export class BookService {
  constructor(@InjectModel('Book') private readonly bookModel: Model<Book>) {}

  createBook = async (bookData: {
    image: string;
    name: string;
    author: string;
    category: string;
    publishDate: string;
    numOfPages: number;
    preface: string;
    link: string;
  }) => {
    try {
      const foundBook = await this.bookModel
        .findOne({ name: bookData.name })
        .exec();

      if (foundBook) {
        throw new BadRequestException({
          message: 'This book already exists',
        });
      }

      const newBook = new this.bookModel({
        image: bookData.image,
        name: bookData.name,
        author: bookData.author,
        category: bookData.category,
        publishDate: bookData.publishDate,
        numOfPages: bookData.numOfPages,
        preface: bookData.preface,
        link: bookData.link,
      });

      const result = await newBook.save();
      return { message: 'Book added successfully', id: result.id };
    } catch (error) {
      throw new BadRequestException(errorObj(error));
    }
  };

  listBooks = async () => {
    try {
      const books = await this.bookModel.find({});
      return books.map((book) => this.bookInfo(book));
    } catch (error) {
      throw new BadRequestException(errorObj(error));
    }
  };

  getBook = async (bookId: string) => {
    const book = await this.findBook(bookId);
    return this.bookInfo(book);
  };

  editBook = async (
    bookId: string,
    bookData: {
      image: string;
      name: string;
      author: string;
      category: string;
      publishDate: string;
      numOfPages: number;
      preface: string;
      link: string;
    },
  ) => {
    const book = await this.findBook(bookId);
    try {
      book.image = bookData.image ? bookData.image : book.image;
      book.name = bookData.name ? bookData.name : book.name;
      book.author = bookData.author ? bookData.author : book.author;
      book.category = bookData.category ? bookData.category : book.category;
      book.publishDate = bookData.publishDate
        ? bookData.publishDate
        : book.publishDate;
      book.numOfPages = bookData.numOfPages
        ? bookData.numOfPages
        : book.numOfPages;
      book.preface = bookData.preface ? bookData.preface : book.preface;
      book.link = bookData.link ? bookData.link : book.link;

      await book.save();
      return { response: { message: 'Book data updated successsfully' } };
    } catch (error) {
      throw new BadRequestException(errorObj(error));
    }
  };

  deleteBook = async (bookId: string) => {
    const book = await this.findBook(bookId);

    try {
      await book.remove();
      return { response: { message: 'Book deleted successsfully' } };
    } catch (error) {
      throw new BadRequestException(errorObj(error));
    }
  };

  clearBooks = async () => {
    try {
      await this.bookModel.deleteMany({});
      return { response: { message: 'Books delted!' } };
    } catch (error) {
      throw new BadRequestException(errorObj(error));
    }
  };

  private findBook = async (id: string) => {
    try {
      const book = await this.bookModel.findById(id).exec();

      if (!book) throw new NotFoundException('Book not found');

      return book;
    } catch (error) {
      throw new BadRequestException(errorObj(error));
    }
  };

  private bookInfo = (
    bookData: Book & {
      _id: Types.ObjectId;
    },
  ) => {
    return {
      id: bookData.id,
      image: bookData.image,
      name: bookData.name,
      author: bookData.author,
      category: bookData.category,
      publishDate: bookData.publishDate,
      numOfPages: bookData.numOfPages,
      preface: bookData.preface,
      link: bookData.link,
    };
  };
}
