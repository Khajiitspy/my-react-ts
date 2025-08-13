import {Link, Outlet} from "react-router";
import {useAppDispatch, useAppSelector} from "../../Store";
//import {useNavigate} from "react-router-dom";
import {logout} from "../../Store/authSlice.ts";
import {Button} from "antd";
import {APP_ENV} from "../../env";
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge } from 'antd';

const UserLayout: React.FC = () => {
    const {user} = useAppSelector(state => state.auth);
    var {items} = useAppSelector(state => state.cart) || -1;
    console.log(items);
    const dispatch = useAppDispatch();
    //const navigate = useNavigate();

    /*function logoutUser() {
        // console.log("logoutUser");
        dispatch(logout());
        navigate('/');
    }*/


    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
            <header className="w-full py-4 px-6 bg-orange-500 text-white shadow-md flex justify-between">
                <Link to="/" className="text-xl font-semibold">FoodDelivery</Link>
                <div className="flex items-center gap-4">
                {user && (
                  <Link to="/account" className="flex items-center gap-2">
                    <img
                      src={user.image ? `${APP_ENV.IMAGES_50_URL}${user.image}` : '/images/user/default.png'}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-white object-cover"
                    />
                    <span className="font-medium">{user.name}</span>
                  </Link>
                )}

                <Link to="/cart" className="relative">
                  <Badge count={items.length} offset={[0, 0]}>
                    <Button
                      icon={<ShoppingCartOutlined />}
                      className="bg-white text-orange-500 border-none hover:bg-orange-100"
                    >
                      Кошик
                    </Button>
                  </Badge>
                </Link>

                {user ? (
                  <>
                    {user.roles.includes("Admin") && (
                        <Link
                          to="/admin/home"
                          className="bg-white text-orange-500 px-3 py-1 rounded hover:bg-orange-100 transition"
                        >
                          Адмінка
                        </Link>
                    )}
                      
                    <Button
                      onClick={() => {dispatch(logout());
                      localStorage.removeItem('cart')}} // something called privacy
                      className="bg-white text-orange-500 border-none hover:bg-orange-100"
                    >
                      Вихід
                    </Button>
                  </>
                  ) : (
                  <>
                    <Link
                        to="login"
                        className="bg-white text-orange-500 px-4 py-2 rounded hover:bg-orange-100 transition"
                    >
                        Вхід
                    </Link>
                    <Link
                        to="register"
                        className="bg-white text-orange-500 px-4 py-2 rounded hover:bg-orange-100 transition"
                    >
                        Реєстрація
                    </Link>
                  </>
                )}
                </div>
            </header>

            <main className="flex-1 p-4 md:p-6">
                <Outlet/>
            </main>

            <footer className="w-full py-3 px-6 bg-gray-100 text-sm text-center dark:bg-gray-800 dark:text-gray-300">
                © 2025 FoodDelivery. Усі права захищено.
            </footer>
        </div>
    );
};

export default UserLayout;
