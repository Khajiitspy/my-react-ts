import { Navigate, Outlet } from "react-router-dom";
import {useAppSelector} from "../../Store";

const RequireAdmin = () => {
    const { user } = useAppSelector(state=>state.auth);

    if (!user || !user.roles.includes("Admin")) {
        return <Navigate to="/account" replace />;
    }

    return <Outlet />;
};

export default RequireAdmin;
