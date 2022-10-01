import { Module } from '@nestjs/common';
import { AuthorController } from './author.controller';
import { AuthorService } from './author.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorSchema } from './author.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Author', schema: AuthorSchema }]),
  ],
  controllers: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
