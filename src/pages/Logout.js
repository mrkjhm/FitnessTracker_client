import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Logout() {

    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Clear token and reset user context
        localStorage.clear();

        setUser({
            id: null,
            isAdmin: null
        });

        // Redirect after clearing
        navigate('/login');
    }, [setUser, navigate]);

    return null; // No need to render anything
}
