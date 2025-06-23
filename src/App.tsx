import './App.css'
import {BrowserRouter as Router, Route, Routes} from "react-router";
import UserLayout from "./layout/User/UserLayout.tsx";
import UserHomePage from "./pages/OtherPage/UserHomePage.tsx";
import AdminLayout from "./layout/Admin/AdminLayout.tsx";
import DashboardHome from "./pages/Dashboard/DashboardHome.tsx";
import CategoriesListPage from "./pages/Categories";
import NotFound from "./pages/OtherPage/NotFound.tsx";
import CategoriesCreatePage from "./pages/Categories/create";
import EditCategoryPage from "./pages/Categories/edit";
import LoginPage from "./pages/Account/Login.tsx";
import RequireAdmin from "./components/ProtectedRoute/RequireAdmin.tsx";

const App: React.FC = () => {


    return (
        <>
            <Router>
                <Routes>
                    {/*<Route index element={<UserLayout>}></Route>*/}

                    <Route path="/" element={<UserLayout />}>
                        <Route index element={<UserHomePage />} />
                    </Route>


                    <Route path="admin" element={<RequireAdmin />}>
                        <Route element={<AdminLayout />}>
                            <Route path="home" element={<DashboardHome />} />
                            <Route path="categories">
                                <Route index element={<CategoriesListPage />} />
                                <Route path="create" element={<CategoriesCreatePage />} />
                                <Route path="edit/:id" element={<EditCategoryPage />} />
                            </Route>
                        </Route>
                    </Route>

                    <Route path="account">
                        <Route index element={<LoginPage />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </>
    )
}

export default App