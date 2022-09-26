import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BookService } from './book.service';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async addBook(
    @Body('name') name: string,
    @Body('author') author: string,
    @Body('publishDate') publishDate: string,
    @Body('numOfPages') numOfPages: number,
  ) {
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
}
