import { User } from './user.interface';

export interface Article {
  _id?: number;
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
  author: User;
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
  author: User;
}
