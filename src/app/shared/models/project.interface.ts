import {Timestamp} from 'firebase/firestore';

export interface IProject {
    id?: string;
    /** @deprecated Use 'id' instead - kept for backward compatibility */
    _id?: string;
    title: string;
    content: string;
    description: string;
    coverImage: string;
    additionalImages: Image[];
    techUsed: string[];
    thumbnail: string;
    createdAt?: string | Timestamp;
    [key: string]: any;
}

export interface Image {
    url: string,
    description: string,
    id?: string
    /** @deprecated Use 'id' instead */
    _id?: string
}

export interface CreateProjectDto {
    title: string;
    content: string;
    description: string;
    coverImage: File;
    additionalImages: File[];
    imageDescriptions?: { [key: string]: string };
    techUsed: string[];
    thumbnail: File;
    removedImages?: string[];
}
