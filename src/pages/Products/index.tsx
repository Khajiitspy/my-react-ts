import { useState } from 'react';
import { useGetProductsQuery } from '../../Services/apiProduct';
import {Link, useNavigate} from 'react-router-dom';
import {APP_ENV} from "../../env";

const ProductsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
    const navigate = useNavigate();

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
                <Link to="/admin/products/create" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Create Product
                </Link>
            </div>

            {isLoading && <p>Loading...</p>}
            {error && <p>Error loading products.</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data?.items.map(product => (
                    <div
                        key={product.id}
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="border rounded border-amber-500 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
                    >
                        <img
                            src={`${APP_ENV.IMAGES_800_URL}${product.image}`}
                            alt={product.name}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4 flex flex-col h-full bg-gray-500">
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-green-400">₴{product.price}</p>
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
