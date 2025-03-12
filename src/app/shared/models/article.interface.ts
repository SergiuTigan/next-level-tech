import { User } from './user.interface';

export interface Article {
  _id?: string;
  title: string;
  content: string;
  description: string;
  category: string;
  createDate: string;
  coverImage: string;
  images: Image[];
  imageDescriptions?: { [key: string]: string };
  tags: string[];
  likes: number;
  comments: string[];
  thumbnail: string;
  author: User;
}
export interface Image{
  url:string,
  description: string,
  _id?: string
}

export interface CreateArticleDto {
  title: string;
  content: string;
  description: string;
  category: string;
  createDate: string;
  coverImage: File;
  images: File[];
  imageDescriptions?: { [key: string]: string };
  tags: string[];
  likes: number;
  comments: string[];
  thumbnail: File;
  author?: User;
}
