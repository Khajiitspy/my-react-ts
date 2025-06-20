export interface ICategoryItem {
    id: string;
    name: string;
    slug: string;
    image: string;
}

export interface ICategoryCreate {
    name: string;
    image: File;
}

export interface ICategoryEdit {
    id: number;
    name: string;
    image: File;
}
