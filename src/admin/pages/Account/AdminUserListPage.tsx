// pages/admin/users/AdminUserListPage.tsx
import { useSearchUsersQuery } from '../../../Services/apiUsers.ts';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '../../../components/ui/table';
import LoadingOverlay from '../../../components/ui/loading/LoadingOverlay.tsx';
import { APP_ENV } from '../../../env';
import { useState } from 'react';

const AdminUserListPage = () => {
    const [role, setRole] = useState('');
    const [fullName, setFullName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const { data: users, isLoading } = useSearchUsersQuery({
        role: role || undefined,
        fullName: fullName || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page: currentPage,
        pageSize,
    });

    const totalPages = users ? Math.ceil(users.totalItems / pageSize) : 1;

    console.log(users);
    
    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    const resetPage = () => setCurrentPage(1);

    return (
        <>
            {isLoading && <LoadingOverlay />}
            <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
                <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-end sm:justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Користувачі</h3>
                    <div className="flex flex-wrap gap-2">
                        <input type="text" placeholder="Роль" value={role} onChange={e => { setRole(e.target.value); resetPage(); }} className="border rounded px-2 py-1" />
                        <input type="text" placeholder="ПІБ" value={fullName} onChange={e => { setFullName(e.target.value); resetPage(); }} className="border rounded px-2 py-1" />
                        <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); resetPage(); }} className="border rounded px-2 py-1" />
                        <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); resetPage(); }} className="border rounded px-2 py-1" />
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
                            <TableRow>
                                <TableCell isHeader className="py-3 text-start">ПІБ</TableCell>
                                <TableCell isHeader className="py-3 text-start">Email</TableCell>
                                <TableCell isHeader className="py-3 text-start">Фото</TableCell>
                                <TableCell isHeader className="py-3 text-start">Типи входу</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {
                                users?.items.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell className="py-3 text-gray-800 dark:text-white/90">{user.fullName}</TableCell>
                                        <TableCell className="py-3 text-gray-600 dark:text-gray-300">{user.email}</TableCell>
                                        <TableCell className="py-3">
                                            <div className="h-[50px] w-[50px] overflow-hidden rounded-md">
                                                {user.image ? (
                                                    <img
                                                        src={`${APP_ENV.IMAGES_100_URL}${user.image}`}
                                                        alt={user.fullName}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                                                        No image
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-3 text-gray-600 dark:text-gray-300">
                                            {user.loginTypes.join(', ')}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
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

export default AdminUserListPage;
