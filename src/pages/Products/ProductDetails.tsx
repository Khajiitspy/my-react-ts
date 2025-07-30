import { useParams} from "react-router-dom";
import { useState } from "react";
import { useGetProductByIdQuery } from "../../Services/apiProduct";
import {APP_ENV} from "../../env";
// import { useCart } from "../../context/CartContext";
import type { CartItemDto } from "../../Services/types";
import {useAppDispatch, useAppSelector} from "../../Store";
import {useAddToCartMutation} from "../../Services/apiCart.ts";
import {createUpdateCartLocal} from "../../Store/cartSlice.ts";
import {message, Breadcrumb} from "antd";

const ProductDetailsPage = () => {
    const { id } = useParams();
    const { data: product, isLoading } = useGetProductByIdQuery(Number(id));
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const {user} = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const [addToCart] = useAddToCartMutation();
    // const { addToCart } = useCart();

    if (isLoading || !product) return <div>Loading...</div>;

    const currentVariant = product.variants[selectedVariantIndex];
    const currentImage = currentVariant.images[currentImageIndex];

    const availableSizes = [
        ...new Set(product.variants.map(v => v.size).filter(Boolean))
    ];

    const handleSizeChange = (size: string) => {
        const newIndex = product.variants.findIndex(v => v.size === size);
        if (newIndex !== -1) {
            setSelectedVariantIndex(newIndex);
            setCurrentImageIndex(0);
        }
    };

    const nextImage = () => {
        setCurrentImageIndex(prev =>
            (prev + 1) % (currentVariant.images?.length || 1)
        );
    };

    const prevImage = () => {
        setCurrentImageIndex(prev =>
            (prev - 1 + (currentVariant.images?.length || 1)) %
            (currentVariant.images?.length || 1)
        );
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
                    productVariantId: product.id,
                    quantity: 1
                }).unwrap();
              message.success("Added product to cart!");
            } catch (err) {
              console.error(err);
              console.log(product);
              message.error("Failed to add product to cart!");
            }
        }
    };

    return (
        <div className="container mx-auto px-6 py-10 max-w-6xl">
            <Breadcrumb
              items={[
                {
                  title: <a href="/">Home</a>,
                },
                {
                  title: <a href="/products">Products</a>,
                },
                {
                  title: currentVariant.name
                },
              ]}
            />
            <h1 className="text-3xl font-bold mb-8 text-center">{currentVariant.name}</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="flex flex-col items-center">
                    <div className="relative w-full max-w-md">
                        <img
                            src={`${APP_ENV.IMAGES_800_URL}${currentImage}`}
                            alt={currentVariant.name}
                            className="rounded-xl w-full h-96 object-cover border shadow-md border-amber-500"
                        />
                    </div>
                    <div className="flex mt-4 gap-2">
                        <button onClick={prevImage} className="text-2xl px-3 py-1 bg-amber-500 hover:bg-white shadow rounded-xl">
                            &laquo;
                        </button>
                        <button onClick={nextImage} className="text-2xl px-3 py-1 bg-amber-500 hover:bg-white shadow rounded-xl">
                            &raquo;
                        </button>
                    </div>
                </div>
                
                <div className="lg:col-span-2">
                    <h2 className="text-4xl font-semibold text-green-600">₴{currentVariant.price}</h2>
                    <span className="text-gray-400 mt-1">Weight: </span> {currentVariant.weight}g
                    <br />
                    <span className="text-gray-400 mt-1">Category:</span> {currentVariant.category}

                    {availableSizes.length > 0 && (
                        <div className="mt-6">
                            <p className="mb-2 text-sm text-gray-600">Choose size:</p>
                            <div className="flex gap-3">
                                {availableSizes.map((size, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSizeChange(size)}
                                        className={`px-4 py-2 rounded-full border transition 
                                    ${currentVariant.size === size
                                            ? 'bg-amber-500 text-white border-gray-500'
                                            : 'bg-white text-amber-500 border-white hover:bg-amber-200'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <h3 className="text-xl font-semibold mb-4 mt-10">Ingredients</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentVariant.ingredients.map((ingredient, index) => (
                            <div key={index} className="text-center">
                                <img
                                    src={`${APP_ENV.IMAGES_200_URL}${ingredient.imageUrl}`}
                                    alt={ingredient.name}
                                    className="w-20 h-20 object-cover rounded-full border border-amber-500 shadow mx-auto mb-2"
                                />
                                <p className="text-sm">{ingredient.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10">
                        <button
                            onClick={() =>
                                handleAddToCart({
                                    productVariantId: currentVariant.id,
                                    quantity: 1,
                                    name: currentVariant.name,
                                    categoryName: currentVariant.category,
                                    price: currentVariant.price,
                                    imageName: currentVariant.images[0]
                                })
                            }
                            className="bg-amber-500 hover:bg-amber-600 text-white text-lg font-semibold px-6 py-3 rounded shadow transition"
                        >
                            Додати до кошика
                        </button>
                    </div> 
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;
