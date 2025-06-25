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


export interface IRegister
{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    imageFile: string;
}

export interface ServerError {
    status: number;
    data: {
        errors: Record<string, string[]>;
    };
}

export interface Product {
    id: number;
    name: string;
    image: string;
    price: number;
}

export interface ProductVariant {
    id: number;
    name: string;
    price: number;
    weight: number;
    size: string;
    category: string;
    images: string[];
    ingredients: {
        name: string;
        imageUrl: string;
    }[];
}

export interface ProductDetailsDto {
    variants: ProductVariant[];
}