import React, { useState, useContext, createContext, useEffect } from 'react'
import { getCurrentUser } from '../apis/user';

export const AuthContext = createContext({isAuthenticated: false, isLoading: true, setIsAuthenticated: (value) => {}});

export const AuthContextProvider = ({children}) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAuthenticatedUser();
    }, [isAuthenticated, isLoading]);

    const getAuthenticatedUser = async () => {
        getCurrentUser().then((user) => {
            setIsAuthenticated(true);
        }).catch((error) => {
            setIsAuthenticated(false);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated: isAuthenticated,
            setIsAuthenticated: setIsAuthenticated,
            isLoading: isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    return useContext(AuthContext);
};
