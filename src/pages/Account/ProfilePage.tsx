import {APP_ENV} from "../../env";
import { useAppSelector} from "../../Store";
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const {user} = useAppSelector(state => state.auth);
    const navigate = useNavigate();

    return (
        <div>
            {user && (
                <div className="container mx-auto px-6 py-10 max-w-6xl flex flex-col items-center">
                    <div className="relative w-full max-w-md">
                        <img
                            src={user.image ? `${APP_ENV.IMAGES_400_URL}${user.image}` : '/images/user/default.png'}
                            alt={user.name}
                            className="rounded-xl w-full h-96 object-cover border shadow-md border-amber-500"
                        />
                    </div>
                    <h1 className="text-3xl font-bold mt-4 mb-2 text-center">Hello, {user.name}</h1>
                    <h1 className="text-2xl mb-8 text-center">{user.email}</h1>

                    <button
                      onClick={() => {navigate("/orderHistory")}}
                      className="bg-amber-500 hover:bg-amber-600 text-white text-lg font-semibold px-6 py-3 rounded shadow transition mt-5"
                    >
                      Order History
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
