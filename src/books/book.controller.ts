import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  NotFoundException,
} from '@nestjs/common';
import { BookService } from './book.service';

@Controller('api/v1/books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async addBook(
    @Body('name') name: string,
    @Body('author') author: string,
    @Body('publishDate') publishDate: string,
    @Body('numOfPages') numOfPages: number,
  ) {
    if (!name) throw new NotFoundException('name is a required field');
    if (!author) throw new NotFoundException('author is a required field');
    if (!publishDate)
      throw new NotFoundException('publishDate is a required field');
    if (!numOfPages)
      throw new NotFoundException('numOfPages is a required field');

    const bookCreateRes = await this.bookService.createBook(
      name,
      author,
      publishDate,
      numOfPages,
    );
    return bookCreateRes;
  }

  @Get()
  async getBooks() {
    const bookList = await this.bookService.listBooks();
    return bookList;
  }

  @Get(':id')
  async getBookById(@Param('id') bookId: string) {
    const book = await this.bookService.getBook(bookId);
    return book;
  }

  @Patch(':id')
  async updateBook(
    @Param('id') bookId: string,
    @Body('name') name: string,
    @Body('author') author: string,
    @Body('publishDate') publishDate: string,
    @Body('numOfPages') numOfPages: number,
  ) {
    const bookEdit = await this.bookService.editBook(bookId, {
      name,
      author,
      publishDate,
      numOfPages,
    });
    return bookEdit.response;
  }

  @Delete(':id')
  async removeBook(@Param('id') bookId: string) {
    const bookDelete = await this.bookService.deleteBook(bookId);
    return bookDelete.response;
  }
}
