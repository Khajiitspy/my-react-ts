import {Table, TableBody, TableCell, TableHeader, TableRow} from "../../../components/ui/table";
import {APP_ENV} from "../../../env";
import {Link} from "react-router";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {useGetProductsQuery} from "../../../Services/apiProduct.ts";
import LoadingOverlay from "../../../components/ui/loading/LoadingOverlay.tsx";
import {useState} from "react";

const AdminProductListPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
    const { data: products, isLoading} = useGetProductsQuery({
        search: searchTerm,
        page: currentPage,
        pageSize
    });

    const totalPages = products ? Math.ceil(products.totalItems / pageSize) : 1;

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <>
            {isLoading && <LoadingOverlay/>}
            <div
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Products
                    </h3>
                    <input
                        type="text"
                        className="border rounded px-3 py-1 w-1/4"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                            <TableRow>
                                <TableCell isHeader className="py-3 text-start">Назва</TableCell>
                                <TableCell isHeader className="py-3 text-start">Ціна</TableCell>
                                <TableCell isHeader className="py-3 text-start">Фото</TableCell>
                                <TableCell isHeader className="py-3 text-start">Дії</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {
                                products?.items.map((product) => {
                                        const image = product.image;
                                        return (
                                            <TableRow key={product.id}>
                                                <TableCell className="py-3 font-medium text-gray-800 dark:text-white/90">
                                                    {product.name}
                                                </TableCell>

                                                <TableCell className="py-3 text-gray-600 dark:text-gray-300">
                                                    {product.price} грн
                                                </TableCell>

                                                <TableCell className="py-3">
                                                    <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                                                        {image ? (
                                                            <img
                                                                src={`${APP_ENV.IMAGES_100_URL}${image}`}
                                                                alt={product.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div
                                                                className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                                                                No image
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                <TableCell className="py-3 text-gray-500 dark:text-gray-400">
                                                    <div className="flex space-x-4">
                                                        <Link
                                                            to={`edit/${product.id}`}
                                                            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                                        >
                                                            <EditOutlined className="mr-1"/>
                                                            <span className="font-medium underline">Edit</span>
                                                        </Link>

                                                        <div
                                                            className="flex items-center cursor-pointer text-red-600 hover:text-red-800 transition-colors duration-200">
                                                            <DeleteOutlined className="mr-1"/>
                                                            <span className="font-medium underline">Remove</span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    }
                                )}
                        </TableBody>
                    </Table>
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
        </>
    );
};


export default AdminProductListPage;