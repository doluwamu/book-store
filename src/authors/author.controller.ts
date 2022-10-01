import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthorService } from './author.service';

@Controller('authors')
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @Post('')
  async addAuthor(
    @Body('name') name: string,
    @Body('DOB') DOB: string,
    @Body('biography') biography: string,
    @Body('numOfBooks') numOfBooks: number,
  ) {
    const age = this.authorService.calcAge(DOB);

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
}
