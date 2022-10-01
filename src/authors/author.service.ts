import { Model } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
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
      return {
        id: authorData.id,
        name: authorData.name,
        DOB: authorData.DOB,
        age: authorData.age,
        numOfBooks: authorData.numOfBooks,
        biography: authorData.biography,
      };
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
      return authors.map((author) => ({
        id: author.id,
        name: author.name,
        DOB: author.DOB,
        age: author.age,
        numOfBooks: author.numOfBooks,
        biography: author.biography,
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
}
