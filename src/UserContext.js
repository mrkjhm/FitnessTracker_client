// UserContext.js
import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const API_URL = process.env.REACT_APP_API_URL;

    const [user, setUser] = useState({ id: null, isAdmin: null });

    const unsetUser = () => {
        localStorage.clear();
        setUser({ id: null, isAdmin: null });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        fetch(`${API_URL}/users/details`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser({
                        id: data.user._id,
                        isAdmin: data.user.isAdmin,
                    });
                }
            })
            .catch((err) => console.error('User fetch error:', err));
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, unsetUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
