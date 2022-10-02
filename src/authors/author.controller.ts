import {
  Param,
  Body,
  Controller,
  Get,
  Post,
  Patch,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { AuthorService } from './author.service';

@Controller('api/v1/authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post('')
  async addAuthor(
    @Body('name') name: string,
    @Body('DOB') DOB: string,
    @Body('numOfBooks') numOfBooks: number,
    @Body('biography') biography: string,
  ) {
    const age = this.authorService.calcAge(DOB);

    if (!name) throw new NotFoundException('name is a required field');
    if (!DOB) throw new NotFoundException('DOB is a required field');
    if (!numOfBooks)
      throw new NotFoundException('numOfBooks is a required field');
    if (!biography)
      throw new NotFoundException('biography is a required field');

    const authorData = {
      name,
      DOB,
      age,
      numOfBooks,
      biography,
    };

    const createdAuthor = await this.authorService.createAuthor(authorData);
    return createdAuthor;
  }

  @Get('')
  async getAuthors() {
    const authors = await this.authorService.listAuthors();
    return authors;
  }

  @Get(':id')
  async getAuthor(@Param('id') authorId: string) {
    const author = await this.authorService.getAuthor(authorId);
    return author;
  }

  @Patch(':id')
  async updateAuthorDetails(
    @Param('id') authorId: string,
    @Body('name') name: string,
    @Body('DOB') DOB: string,
    @Body('numOfBooks') numOfBooks: number,
    @Body('biography') biography: string,
  ) {
    let age: number;
    if (DOB && DOB.length > 0) age = this.authorService.calcAge(DOB);
    const authorData = {
      name,
      DOB,
      age,
      numOfBooks,
      biography,
    };

    const updatedAuthor = await this.authorService.editAuthor(
      authorId,
      authorData,
    );

    return updatedAuthor;
  }

  @Delete(':id')
  async removeAuthor(@Param('id') authorId: string) {
    const authorDelete = await this.authorService.deleteAuthor(authorId);
    return authorDelete.response;
  }
}
