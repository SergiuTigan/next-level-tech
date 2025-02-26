import { Author } from './author.interface';

export interface Article {
  title: string;
  description:string;
  category: string;
  createDate: string;
  coverImage: string;
  thumbnail: string;
  author: Author;

}
