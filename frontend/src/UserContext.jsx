import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext(null);

export function UserContextProvider({ children }) {
    const [id, setId] = useState(null);

    useEffect(() => {
        // TODO: axios get user profile
    }, []);

    return (
        <UserContext.Provider value={{ id, setId }}>
            {children}
        </UserContext.Provider>
    );
}