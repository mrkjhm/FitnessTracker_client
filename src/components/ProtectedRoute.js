import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import UserContext from '../UserContext';

export default function ProtectedRoute() {
    const { user, isLoadingUser } = useContext(UserContext);

    if (isLoadingUser) {
        // Show a loading UI while checking user
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h4>Checking session...</h4>
            </div>
        );
    }

    if (!user?.id) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
