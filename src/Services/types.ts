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
    dateCreated: string;
    isLoginGoogle: boolean;
    isLoginPassword: boolean;
    roles: string[];
}

export interface PagedResult<T> {
    items: T[];
    totalItems: number;
    page: number;
    pageSize: number;
}

export interface AdminUserSearchParams {
    roles?: string[];
    fullName?: string;
    registeredFrom?: string;
    registeredTo?: string;
    page?: number;
    pageSize?: number;
}

export interface AdminUserViewModel {
    id: number;
    firstName: string;
    lastName: string;
    viewImage: string;
    roles: string[];
}

export interface UserEditRequest{
    id: number,
    firstName: string,
    lastName: string,
    image?: File,
    roles: string[]
}

export interface CartItemDto {
  productVariantId: number;
  name: string;
  categoryId: number;
  categoryName: string;
  quantity: number;
  price: number;
  imageName: string;
}

export interface CartItemRequestDto {
  productVariantId: number;
  quantity: number;
}

export interface OrderItemModel{
  id: number;
  productVariantName: string;
  count: number;
  priceBuy: number;
  total: number;
}

export interface OrderModel {
  id: number;
  status: string;
  createdAt: string;
  items: OrderItemModel[];
  total: number;
  city: string;
  postDepartment: string;
  paymentType: string;
  phoneNumber: string;
  recipientName: string;
}

export interface OrderInformation {
  cityId: number;
  postDepartmentId: number;
  paymentTypeId: number;
  phoneNumber: string;
  email: string;
  recipientName: string;
}

export interface SimpleValue {
    name: string;
    id: number;
}

export interface IFullName {
    firstName: string;
    lastName: string;
}

export interface IEditProfile {
    firstName: string;
    lastName: string;
    email: string;
    image?: File;
}

export interface ProductSearchModel {
    name?: string;
    categoryId?: number;
    page?: number;
    pageSize?: number;
}
