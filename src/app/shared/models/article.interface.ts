import {User} from './user.interface';

export interface Article {
  _id?: string;
  title: string;
  published: boolean;
  content: string;
  description: string;
  category: string;
  createDate: string;
  coverImage: string;
  additionalImages: Image[];
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
  published: boolean;
  content: string;
  description: string;
  category: string;
  createDate: string;
  coverImage: File | null;
  images: File[];
  imageDescriptions?: { [key: string]: string };
  tags: string[];
  likes: string[];
  comments: Comment[];
  thumbnail: File | null;
  author?: User;
}

interface Comment {
  _id: string | null;
  userName: string;
  userId: string;
  comment: string;
  timestamp: string;
}
