import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

type RequireAuthProps = {
    allowedRoles: number[]
};

const RequireAuth: React.FC<RequireAuthProps> = ({ allowedRoles }) => {
    const location = useLocation();
    const { roles } = useAuth();

    const isAuthorized: boolean = roles.some((role: number) => allowedRoles.includes(role));

    if (isAuthorized) {
        return <Outlet />;
    } else {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
};

export default RequireAuth;
