import { Model, Types } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Author } from './author.model';

@Injectable()
export class AuthorService {
  constructor(
    @InjectModel('Author') private readonly authorModel: Model<Author>,
  ) {}

  createAuthor = async (authorInfo: {
    name: string;
    DOB: string;
    age: number;
    numOfBooks: number;
    biography: string;
  }) => {
    try {
      const authorData = new this.authorModel({
        name: authorInfo.name,
        DOB: authorInfo.DOB,
        age: authorInfo.age,
        numOfBooks: authorInfo.numOfBooks,
        biography: authorInfo.biography,
      });
      await authorData.save();
      return { message: 'Author info successfully added', id: authorData.id };
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

  listAuthors = async () => {
    try {
      const authors = await this.authorModel.find({}).exec();
      return authors.map((author) => this.authorInformation(author));
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

  getAuthor = async (authorId: string) => {
    const author = await this.findAuthor(authorId);
    return this.authorInformation(author);
  };

  editAuthor = async (
    authorId: string,
    authorDetails: {
      name: string;
      DOB: string;
      age: number;
      numOfBooks: number;
      biography: string;
    },
  ) => {
    const author = await this.findAuthor(authorId);

    author.name = authorDetails.name ? authorDetails.name : author.name;
    author.DOB = authorDetails.DOB ? authorDetails.DOB : author.DOB;
    author.age = authorDetails.age ? authorDetails.age : author.age;
    author.numOfBooks = authorDetails.numOfBooks
      ? authorDetails.numOfBooks
      : author.numOfBooks;
    author.biography = authorDetails.biography
      ? authorDetails.biography
      : author.biography;

    try {
      await author.save();
      return { message: 'Author details updated successfully!' };
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

  deleteAuthor = async (authorId: string) => {
    const author = await this.findAuthor(authorId);

    try {
      await author.remove();
      return { response: { message: 'Author successfully removed' } };
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

  findAuthor = async (authorId: string) => {
    try {
      const author = await this.authorModel.findById(authorId).exec();

      if (!author) throw new NotFoundException('Author not found!');

      return author;
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

  calcAge = (DOB: string): number => {
    const convertedDOB = new Date(DOB);
    //calculate month difference from current date in time
    const month_diff = Date.now() - convertedDOB.getTime();

    //convert the calculated difference in date format
    const age_dt = new Date(month_diff);

    //extract year from date
    const year = age_dt.getUTCFullYear();

    //now calculate the age of the user
    const age = Math.abs(year - 1970);
    return age;
  };

  authorInformation = (
    author: Author & {
      _id: Types.ObjectId;
    },
  ) => {
    return {
      id: author.id,
      name: author.name,
      DOB: author.DOB,
      age: author.age,
      numOfBooks: author.numOfBooks,
      biography: author.biography,
    };
  };
}
