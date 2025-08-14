import { useEffect, useState } from "react";
import { useGetProductsQuery } from '../../Services/apiProduct';
import {useNavigate} from 'react-router-dom';
import {APP_ENV} from "../../env";
import {createUpdateCartLocal} from "../../Store/cartSlice.ts";
import type { CartItemDto, ProductSearchModel } from '../../Services/types.ts';
import {
    Select,
} from "antd";
import LoadingOverlay from "../../components/ui/loading/LoadingOverlay.tsx";
import {useAppDispatch, useAppSelector} from "../../Store";
import {useAddToCartMutation} from "../../Services/apiCart.ts";
import {useGetAllCategoriesQuery} from "../../Services/apiCategory.ts";
import {message, Breadcrumb} from "antd";

const ITEMS_PER_PAGE = 6;

const ProductsPage: React.FC = () => {
    const parseQueryParams = (): ProductSearchModel => {
        const params = new URLSearchParams(location.search);
        return {
            name: params.get("name") || "",
            categoryId: params.has("categoryId") ? parseInt(params.get("categoryId")!) : undefined,
            page: parseInt(params.get("page") || "1", 10),
            pageSize: parseInt(params.get("pageSize") || `${ITEMS_PER_PAGE}`, 10),
        };
    };
    const [searchParams, setSearchParamsState] = useState<ProductSearchModel>(() => parseQueryParams());

    useEffect(() => {
        setSearchParamsState(parseQueryParams());
    }, [location.search]);

    const navigate = useNavigate();

    const updateSearchParams = (updated: Partial<ProductSearchModel>) => {
        const newParams = { ...searchParams, ...updated };
        setSearchParamsState(newParams);

        const urlParams = new URLSearchParams();

        if (newParams.name) urlParams.set("name", newParams.name);
        if (newParams.categoryId && newParams.categoryId > 0) {
            urlParams.set("categoryId", newParams.categoryId.toString());
        }
        if (newParams.page) urlParams.set("page", newParams.page.toString());
        if (newParams.pageSize) urlParams.set("pageSize", newParams.pageSize.toString());

        navigate({ search: urlParams.toString() }, { replace: true });
    };

    const {user} = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const [addToCart] = useAddToCartMutation();
    const {data: categories = []} = useGetAllCategoriesQuery();

    console.log(categories);

    const { data, isLoading, error, isError } = useGetProductsQuery(searchParams);
    
    console.log("Products:", data);
    console.log("Error:", error);

    const handleCategorySearch = (value: number) => {
        updateSearchParams({
            categoryId: value,
            page: 1,
        });
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateSearchParams({
            [name]: name === "pageSize" ? parseInt(value) || 1 : value,
            page: 1,
        });
    };

    const handlePageChange = (newPage: number) => {
        updateSearchParams({ page: newPage });
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
        
        if(user){
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

    if (isLoading) return <LoadingOverlay />;
    if (isError) return <p className="text-gray-600 dark:text-gray-400">Something went wrong.</p>;
    const totalPages = data?.totalItems && data?.pageSize
      ? Math.ceil(data.totalItems / data.pageSize)
      : 1;

    return (
        <div className="container py-6 px-4">
                <Breadcrumb
                  items={[
                    {
                      title: <a href="/">Home</a>,
                    },
                    {
                      title: `${searchParams.categoryId? categories.find(x => Number(x.id) == searchParams.categoryId)?.name : ''} Product`,
                    },
                  ]}
                />
            <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
                <h2 className="text-2xl font-semibold">Products</h2>

                <div className="flex gap-4 flex-wrap justify-end">
                    <div className="flex flex-col">
                        <label htmlFor="name" className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Пошук за ім'ям
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Введіть ім'я"
                            className="rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400 px-3 py-2 min-w-[200px]"
                            value={searchParams.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex flex-col min-w-[200px]">
                        <label htmlFor="categoryId" className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Категорія
                        </label>
                        <Select
                            id="categoryId"
                            placeholder="Оберіть категорію"
                            onChange={handleCategorySearch}
                            value={searchParams.categoryId || undefined}
                            allowClear
                        >
                            {categories.map((cat) => (
                                <Select.Option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </div>
                </div>
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
                <button onClick={() => handlePageChange((data?.page || 1) - 1)} disabled={data?.page === 1} className="px-3 py-1 border rounded">
                    &laquo;
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        className={`px-3 py-1 border rounded ${i + 1 === data?.page ? 'bg-blue-600 text-white' : ''}`}
                        onClick={() => handlePageChange(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
                <button onClick={() => handlePageChange((data?.page || 1) + 1)} disabled={data?.page === totalPages} className="px-3 py-1 border rounded">
                    &raquo;
                </button>
            </div>
        </div>
    );
};

export default ProductsPage;
