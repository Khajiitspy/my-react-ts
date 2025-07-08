import { useEffect, useState } from "react";
import {Link, useLocation, useNavigate} from "react-router";
import { BoxIcon } from "../../../icons";
import {
    Table, TableBody, TableCell, TableHeader, TableRow
} from "../../../components/ui/table";
import {
    useSearchUsersQuery
} from "../../../Services/apiUsers.ts";
import LoadingOverlay from "../../../components/ui/loading/LoadingOverlay.tsx";
import UserTableItem from "../../../components/ui/table/item/UserTableItem.tsx";
import { DatePicker, Checkbox } from 'antd';
import dayjs from 'dayjs';
import type {AdminUserSearchParams} from "../../../Services/types.ts";
const { RangePicker } = DatePicker;

const ITEMS_PER_PAGE = 10;

const UserListPage: React.FC = () => {
    const [filtersOpen, setFiltersOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const parseQueryParams = (): AdminUserSearchParams => {
        const params = new URLSearchParams(location.search);
        return {
            fullName: params.get("fullName") || "",
            roles: params.getAll("roles") || undefined,
            registeredFrom: params.get("registeredFrom") || undefined,
            registeredTo: params.get("registeredTo") || undefined,
            page: parseInt(params.get("page") || "1", 10),
            pageSize: parseInt(params.get("pageSize") || `${ITEMS_PER_PAGE}`, 10),
        };
    };

    const [searchParams, setSearchParamsState] = useState<AdminUserSearchParams>(() => parseQueryParams());

    useEffect(() => {
        setSearchParamsState(parseQueryParams());
    }, [location.search]);

    const updateSearchParams = (updated: Partial<AdminUserSearchParams>) => {
        const newParams = { ...searchParams, ...updated };
        setSearchParamsState(newParams);

        const urlParams = new URLSearchParams();

        if (newParams.fullName) urlParams.set("fullName", newParams.fullName);
        if (newParams.roles) newParams.roles.forEach(role => urlParams.append("roles", role));
        if (newParams.registeredFrom) urlParams.set("registeredFrom", newParams.registeredFrom);
        if (newParams.registeredTo) urlParams.set("registeredTo", newParams.registeredTo);
        if (newParams.page) urlParams.set("page", newParams.page.toString());
        if (newParams.pageSize) urlParams.set("pageSize", newParams.pageSize.toString());

        navigate({ search: urlParams.toString() }, { replace: true });
    };

    const { data, isLoading, isError } = useSearchUsersQuery(searchParams);

    console.log(data);

    const handlePageChange = (newPage: number) => {
        updateSearchParams({ page: newPage });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updateSearchParams({
            [name]: name === "pageSize" ? parseInt(value) || 1 : value,
            page: 1,
        });
    };

    const handleRoleChange = (role: string, checked: boolean) => {
        const currentRoles = searchParams.roles || [];
        const updatedRoles = checked
            ? [...new Set([...currentRoles, role])]
            : currentRoles.filter(r => r !== role);

        updateSearchParams({
            roles: updatedRoles.length > 0 ? updatedRoles : undefined,
            page: 1,
        });
    };

    //@ts-ignore
    const handleDateChange = (dates) => {
        if (!dates) {
            updateSearchParams({ registeredFrom: undefined, registeredTo: undefined, page: 1 });
            return;
        }

        updateSearchParams({
            registeredFrom: dates[0]?.toISOString(),
            registeredTo: dates[1]?.toISOString(),
            page: 1,
        });
    };

    if (isLoading) return <LoadingOverlay />;
    if (isError) return <p className="text-gray-600 dark:text-gray-400">Something went wrong.</p>;

    const users = data?.items || [];
    const totalPages = data?.totalItems && data?.pageSize
      ? Math.ceil(data.totalItems / data.pageSize)
      : 1;
    
    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">

                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Users
                    </h3>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setFiltersOpen(prev => !prev)}
                            className="btn dark:border-gray-600 "
                        >
                            {filtersOpen ? 'Hide Filters' : 'Show Filters'}
                        </button>
                    </div>
                </div>

                {filtersOpen && (
                    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* Пошук по імені */}
                        <div className="flex flex-col">
                            <label htmlFor="fullName" className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Пошук за ім'ям
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                placeholder="Введіть ім'я"
                                className="rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400 px-3 py-2"
                                value={searchParams.fullName}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Ролі */}
                        <div className="flex flex-col">
                            <span className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Фільтр за ролями
                            </span>
                            <div className="flex gap-4">
                                <Checkbox
                                    checked={searchParams.roles?.includes('User')}
                                    onChange={(e) => handleRoleChange('User', e.target.checked)}
                                >
                                    User
                                </Checkbox>
                                <Checkbox
                                    checked={searchParams.roles?.includes('Admin')}
                                    onChange={(e) => handleRoleChange('Admin', e.target.checked)}
                                >
                                    Admin
                                </Checkbox>
                            </div>
                        </div>

                        {/* Діапазон дат */}
                        <div className="flex flex-col">
                            <label htmlFor="dateRange" className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Діапазон дат створення
                            </label>
                            <RangePicker
                                id="dateRange"
                                className="dark:bg-gray-800 dark:text-white"
                                onChange={handleDateChange}
                                value={
                                    searchParams.registeredFrom && searchParams.registeredTo
                                        ? [dayjs(searchParams.registeredFrom), dayjs(searchParams.registeredTo)]
                                        : null
                                }
                            />
                        </div>

                        {/* Кількість елементів на сторінці */}
                        <div className="flex flex-col">
                            <label htmlFor="pageSize" className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Елементів на сторінці
                            </label>
                            <input
                                id="pageSize"
                                type="number"
                                name="pageSize"
                                placeholder="Кількість"
                                className="rounded-lg border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-400 dark:focus:ring-blue-400 px-3 py-2"
                                value={searchParams.pageSize}
                                onChange={handleInputChange}
                                min={1}
                            />
                        </div>

                    </div>
                )}

                <Link
                    to="#"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black text-sm font-medium rounded-lg shadow-md hover:bg-green-400 transition mb-3 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                    <BoxIcon className="text-black dark:text-gray-300 w-5 h-5" />
                    Створити
                </Link>

                {/* Table */}
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                            <TableRow>
                                <TableCell isHeader>Id</TableCell>
                                <TableCell isHeader>Full Name</TableCell>
                                <TableCell isHeader>Email</TableCell>
                                <TableCell isHeader>Created</TableCell>
                                <TableCell isHeader>Roles</TableCell>
                                <TableCell isHeader>Login types</TableCell>
                                <TableCell isHeader>Image</TableCell>
                                <TableCell isHeader>Action</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {users.map(user => (
                                <UserTableItem key={user.id} user={user} />
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-6 gap-2 flex-wrap text-sm text-gray-700 dark:text-gray-300">
                    <button
                      onClick={() => handlePageChange((data?.page || 1) - 1)}
                      disabled={(data?.page || 1) <= 1}
                      className="btn px-3"
                    >
                      ←
                    </button>

                    <button
                      onClick={() => handlePageChange(1)}
                      className={`btn px-3 ${data?.page === 1 ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''}`}
                    >
                      1
                    </button>

                    {data?.page && data.page > 3 && <span className="px-2">...</span>}

                    {data?.page &&
                      [-1, 0, 1].map(offset => {
                        const page = data.page + offset;
                        if (page <= 1 || page >= totalPages) return null;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`btn px-3 ${page === data.page ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''}`}
                          >
                            {page}
                          </button>
                        );
                      })}

                    {data?.page && data.page < totalPages - 2 && <span className="px-2">...</span>}

                    {totalPages > 1 && (
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`btn px-3 ${data?.page === totalPages ? 'bg-gray-200 dark:bg-gray-700 font-bold' : ''}`}
                      >
                        {totalPages}
                      </button>
                    )}

                    <button
                      onClick={() => handlePageChange((data?.page || 1) + 1)}
                      disabled={(data?.page || 1) >= totalPages}
                      className="btn px-3"
                    >
                      →
                    </button>
                  </div>
                )}
            </div>
        </>
    );
};

export default UserListPage;
