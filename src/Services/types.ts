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

export interface ProductSizeModel {
    id: number;
    name: string;
}

export interface ProductIngredientModel {
    id: number;
    name: string;
    image: string;
}

export interface ProductImageModel {
    id: number;
    name: string;
    priority: number;
}

export interface IProductCreate {
    name: string;
    slug: string;
    price: number;
    weight: number;
    categoryId: number;
    productSizeId: number;
    ingredientIds?: number[];
    imageFiles?: File[];
}

// export interface IUserListItem {
//     id: number;
//     email: string;
//     Username?: string;
//     image?: string;
//     loginProvider?: string;
// }

export interface AdminUserListItem {
    id: number;
    fullName: string;
    email: string;
    image: string;
    loginTypes: string[];
}

export interface PagedResult<T> {
    items: T[];
    totalItems: number;
    page: number;
    pageSize: number;
}
