export interface IProject {
    _id?: string;
    title: string;
    content: string;
    description: string;
    coverImage: string;
    images: Image[];
    techUsed: string[];
    thumbnail: string;
    createDate: string;

    [key: string]: any;
}

export interface Image {
    url: string,
    description: string,
    _id?: string
}

export interface CreateProjectDto {
    title: string;
    content: string;
    description: string;
    coverImage: File;
    images: File[];
    imageDescriptions?: { [key: string]: string };
    techUsed: string[];
    thumbnail: File;
    createDate: string;
}
