import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'

type ProtectedRouteProps = {
    roles?: ('admin' | 'user')[];
    children?: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // добавить иконку загрузки 
        return;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};