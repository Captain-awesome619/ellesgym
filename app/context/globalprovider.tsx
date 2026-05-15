'use client'

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { accountt, getCurrentUser } from "../lib/appwrite";
import { databases } from "../lib/appwrite";
import { appwriteConfig } from "../lib/appwrite";

interface GlobalContextType {
  user: any;
  setUser: (user: any) => void;
  isLogged: boolean;
  setIsLogged: (isLogged: boolean) => void;
  loading: boolean;
  refreshUser: () => Promise<any>;
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
  refreshUser: async () => {},
});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 THIS is the important upgrade
  const refreshUser = async () => {
    try {
      const authUser = await accountt.get(); // Appwrite session user

      if (!authUser) {
        setIsLogged(false);
        setUser(null);
        return null;
      }

      // try fetch profile document
      let profile = null;

      try {
        profile = await getCurrentUser();
      } catch (err) {
        profile = null;
      }

      // if profile doesn't exist yet, fallback to auth user
      const mergedUser = profile || authUser;

      setIsLogged(true);
      setUser(mergedUser);

      return mergedUser;
    } catch (err) {
      setIsLogged(false);
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        refreshUser, // 👈 NOW AVAILABLE EVERYWHERE
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;