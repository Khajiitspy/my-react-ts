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
import RegistrationPage from "./pages/Account/Register.tsx";
import ProductsPage from "./pages/Products";
import ProductDetailsPage from "./pages/Products/ProductDetails.tsx";
import AdminProductListPage from "./admin/pages/Products/AdminProductLIst.tsx";
import AdminProductCreatePage from "./admin/pages/Products/CreateProduct.tsx";
import AdminUserListPage from "./admin/pages/Account/AdminUserListPage.tsx";
import ForgotPasswordPage from "./pages/Account/ForgotPassword.tsx";
import ForgotSuccessPage from "./pages/Account/ForgotSuccessPage.tsx";
import {ResetPasswordPage} from "./pages/Account/ResetPasswordPage.tsx";
import EditUserPage from "./admin/pages/Account/EditUserPage.tsx";

const App: React.FC = () => {


    return (
        <>
            <Router>
                <Routes>
                    {/*<Route index element={<UserLayout>}></Route>*/}

                    <Route path="/" element={<UserLayout />}>
                        <Route index element={<UserHomePage />} />
                        <Route path={'login'} element={<LoginPage/>} />
                        <Route path={'forgot-password'} element={<ForgotPasswordPage/>} />
                        <Route path={'forgot-success'} element={<ForgotSuccessPage/>} />
                        <Route path="reset-password" element={<ResetPasswordPage />} />
                        <Route path="register" element={<RegistrationPage />} />
                        <Route path="products" element={<ProductsPage />} />
                        <Route path="/products/:id" element={<ProductDetailsPage />} />
                    </Route>


                    <Route path="admin" element={<RequireAdmin />}>
                        <Route element={<AdminLayout />}>
                            <Route path="home" element={<DashboardHome />} />
                            <Route path="categories">
                                <Route index element={<CategoriesListPage />} />
                                <Route path="create" element={<CategoriesCreatePage />} />
                                <Route path="edit/:id" element={<EditCategoryPage />} />
                            </Route>
                            <Route path="products">
                                <Route index element={<AdminProductListPage/>}/>
                                <Route path="create" element={<AdminProductCreatePage/>}/>
                            </Route>
                            <Route path="users">
                                <Route index element={<AdminUserListPage/>}/>
                                <Route path=":id/edit" element={<EditUserPage/>}/>
                            </Route>
                        </Route>
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </>
    )
}

export default App
