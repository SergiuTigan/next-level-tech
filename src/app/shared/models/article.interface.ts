import { Author } from './author.interface';

export interface Article {
  id?: number;
  title: string;
  content: string;
  description: string;
  category: string;
  createDate: string;
  coverImage: string;
  images: string[];
  tags: string[];
  likes: number;
  comments: string[];
  thumbnail: string;
  author: Author;
}

export interface CreateArticleDto {
  title: string;
  content: string;
  description: string;
  category: string;
  createDate: string;
  coverImage: string;
  images: string[];
  tags: string[];
  likes: number;
  comments: string[];
  thumbnail: string;
}
