'use client'
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getCurrentUser } from "../lib/appwrite";

interface GlobalContextType {
    user: any; 
    setUser: (user: any) => void;
    isLogged: boolean;
    setIsLogged: (isLogged: boolean) => void;
    loading: boolean;
  }
  
  interface GlobalProviderProps {
    children: ReactNode;
  }

  const GlobalContext = createContext<GlobalContextType>({
    user: null,
    setUser: () => {},
    isLogged: false,
    setIsLogged: () => {},
    loading: true,
  });
  
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [isLogged, setIsLogged] = useState<any>(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLogged(true);
          setUser(res);
        } else {
          setIsLogged(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
