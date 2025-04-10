import React, { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../types/user";

interface UserContext {
    user?: User;
    setUser: (user?: User) => void;
}

const UserContext = createContext<UserContext | undefined>(undefined);

interface UserContextProviderProps {
    children: ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | undefined>(undefined);

    return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUserContext = (): UserContext => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserContext must be used within a UserContextProvider");
    }
    return context;
};
