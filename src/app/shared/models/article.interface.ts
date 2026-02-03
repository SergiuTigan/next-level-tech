import {User} from './user.interface';
import {Timestamp} from 'firebase/firestore';

export interface Article {
  id?: string;
  /** @deprecated Use 'id' instead - kept for backward compatibility */
  _id?: string;
  title: string;
  published: boolean;
  content: string;
  description: string;
  category: string;
  createDate: string | Timestamp;
  coverImage: string;
  additionalImages: Image[];
  imageDescriptions?: { [key: string]: string };
  tags: string[];
  likes: string[];
  comments: Comment[];
  thumbnail: string;
  author: User;
  authorId?: string;

  [key: string]: any;
}

export interface Image {
  url: string,
  description: string,
  id?: string
  /** @deprecated Use 'id' instead */
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
  authorId?: string;
}

export interface Comment {
  id?: string | null;
  /** @deprecated Use 'id' instead */
  _id?: string | null;
  userName: string;
  userId: string;
  comment: string;
  timestamp: string | Timestamp;
}
