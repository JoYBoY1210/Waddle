import React, { useEffect, useState, useContext, createContext } from "react";
import { getCSRFTokenFromCookie } from "../getcsrf";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false); 

    useEffect(() => {
        const getUser = async () => {
            const csrftoken = getCSRFTokenFromCookie();

            try {
                const response = await fetch("http://localhost:8000/auth/getUser/", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": csrftoken,
                    },
                    credentials: "include",
                });

                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
                setIsAuthenticated(false);
            }
        };

        getUser(); // Call the function
    }, []); // Run once on mount

    return (
        <UserContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
            {children}
        </UserContext.Provider>
    );
};

const useUser = () => useContext(UserContext);

export { UserContext, UserContextProvider, useUser };
