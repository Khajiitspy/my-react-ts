import { useState } from 'react';
import { useGetProductsQuery } from '../../Services/apiProduct';
import {useNavigate} from 'react-router-dom';
import {APP_ENV} from "../../env";
import {createUpdateCartLocal} from "../../Store/cartSlice.ts";
import type { CartItemDto } from '../../Services/types.ts';
import {useAppDispatch, useAppSelector} from "../../Store";
import {useAddToCartMutation} from "../../Services/apiCart.ts";
import {message} from "antd";

const ProductsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
    const navigate = useNavigate();
    // const {items} = useAppSelector(state => state.cart);
    const {user} = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const [addToCart] = useAddToCartMutation();

    const { data, isLoading, error } = useGetProductsQuery({
        search: searchTerm,
        page: currentPage,
        pageSize
    });
    
    console.log("Products:", data);
    console.log("Error:", error);

    const totalPages = data ? Math.ceil(data.totalItems / pageSize) : 1;

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };


    const handleAddToCart = async (product: any) => {
        if (!product) return;

        console.log(product);
        
        const newItem: CartItemDto = {
            productVariantId: product.productVariantId,
            name: product.name,
            categoryId: 0,
            categoryName: "",
            quantity: product.quantity,
            price: product.price,
            imageName: product.imageName
        }
        
        if(!user){
            dispatch(createUpdateCartLocal(newItem));
        }
        else{
            try {
              await addToCart({
                    productVariantId: product.productVariantId,
                    quantity: 1
                }).unwrap();
              message.success("Added product to cart!");
            } catch (err) {
              console.error(err);
              console.log(product);
              message.error("Failed to add product to cart!");
            }
        }
        dispatch(createUpdateCartLocal(newItem));
    };

    return (
        <div className="container py-6 px-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Products</h2>
                <input
                    type="text"
                    className="border rounded px-3 py-1 w-1/4"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </div>

            {isLoading && <p>Loading...</p>}
            {error && <p>Error loading products.</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.items.map(product => (
                    <div
                        key={product.id}
                        className="border rounded border-amber-500 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col bg-white dark:bg-gray-800"
                    >
                        <div
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="cursor-pointer"
                        >
                            <img
                                src={`${APP_ENV.IMAGES_800_URL}${product.image}`}
                                alt={product.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4 flex-grow">
                                <h3 className="text-lg text-amber-500 font-semibold">{product.name}</h3>
                                <p className="text-green-600 font-medium mt-1">₴{product.price}</p>
                            </div>
                        </div>

                        <div className="p-4 pt-0">
                            <button
                                onClick={() =>
                                    handleAddToCart({
                                        productVariantId: product.id,
                                        quantity: 1,
                                        imageName: product.image,
                                        price: product.price,
                                        name: product.name
                                    })
                                }
                                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2 rounded shadow font-medium transition"
                            >
                                Додати до кошика
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="flex justify-center mt-6 space-x-1">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded">
                    &laquo;
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        className={`px-3 py-1 border rounded ${i + 1 === currentPage ? 'bg-blue-600 text-white' : ''}`}
                        onClick={() => goToPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded">
                    &raquo;
                </button>
            </div>
        </div>
    );
};

export default ProductsPage;
