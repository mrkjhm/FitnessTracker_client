import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const API_URL = process.env.REACT_APP_API_URL;

    const [user, setUser] = useState({ id: null, isAdmin: null });
    const [isLoadingUser, setIsLoadingUser] = useState(true); // 🆕 loading state

    const unsetUser = () => {
        localStorage.clear();
        setUser({ id: null, isAdmin: null });
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsLoadingUser(false); // Done loading if no token
            return;
        }

        fetch(`${API_URL}/users/details`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            credentials: 'include',
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    setUser({
                        id: data.user._id,
                        isAdmin: data.user.isAdmin,
                        userName: data.user.userName,
                        mobileNo: data.user.mobileNo,
                        email: data.user.email,
                        info: data.user.info,
                        avatar: data.user.avatar,
                    });
                }
            })
            .catch((err) => {
                console.error('User fetch error:', err);
            })
            .finally(() => {
                setIsLoadingUser(false); // ✅ done loading
            });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, unsetUser, isLoadingUser }}>
            {!isLoadingUser && children}
        </UserContext.Provider>
    );
};

export default UserContext;
