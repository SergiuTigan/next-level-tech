import {User} from './user.interface';

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
  likes: string[];
  comments: Comment[];
  thumbnail: string;
  author: User;

  [key: string]: any;
}

export interface Image {
  url: string,
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
  comments: Comment[];
  thumbnail: File;
  author?: User;
}

interface Comment {
  _id: string | null;
  userName: string;
  userId: string;
  comment: string;
  timestamp: string;
}
