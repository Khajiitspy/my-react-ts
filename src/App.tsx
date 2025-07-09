import './App.css'
import React from "react" 
import {BrowserRouter as Router, Route, Routes} from "react-router";

const DashboardHome = React.lazy(() => import("./pages/Dashboard/DashboardHome.tsx"));
const AdminLayout = React.lazy(() => import("./layout/Admin/AdminLayout.tsx"));
const NotFound = React.lazy(() => import("./pages/OtherPage/NotFound.tsx"));
const CategoriesListPage = React.lazy(() => import("./pages/Categories"));
const UserLayout = React.lazy(() => import("./layout/User/UserLayout.tsx"));
const UserHomePage = React.lazy(() => import("./pages/OtherPage/UserHomePage.tsx"));
const CategoriesCreatePage = React.lazy(() => import("./pages/Categories/create"));
const EditCategoryPage = React.lazy(() => import("./pages/Categories/edit"));
const LoginPage = React.lazy(() => import("./pages/Account/Login"));
const RegistrationPage = React.lazy(() => import("./pages/Account/Register"));
const RequireAdmin = React.lazy(() => import("./components/ProtectedRoute/RequireAdmin.tsx"));
const ProductsPage = React.lazy(() => import("./pages/Products"));
const ProductDetailsPage = React.lazy(() => import("./pages/Products/ProductDetails.tsx"));
const AdminProductListPage = React.lazy(() => import("./admin/pages/Products/AdminProductLIst.tsx"));
const AdminProductCreatePage = React.lazy(() => import("./admin/pages/Products/CreateProduct.tsx"));
const ForgotPasswordPage = React.lazy(() => import("./pages/Account/ForgotPassword"));
const ForgotSuccessPage = React.lazy(() => import("./pages/Account/ForgotSuccessPage.tsx"));
const ResetPasswordPage = React.lazy(() => import("./pages/Account/ResetPasswordPage.tsx"));
const AdminUserListPage = React.lazy(() => import("./admin/pages/Account/AdminUserListPage.tsx"));
const EditUserPage = React.lazy(() => import("./admin/pages/Account/EditUserPage.tsx"));
const CartPage = React.lazy(() => import("./pages/Cart/List.tsx"));

const App: React.FC = () => {


    return (
        <>
            <Router>
                <React.Suspense fallback={<div>Завантаження...</div>}>
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
                            <Route path="cart" element={<CartPage/>}/>
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
                </React.Suspense>
            </Router>
        </>
    )
}

export default App
