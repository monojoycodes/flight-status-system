import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const data = await api.getMe();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    await checkAuth();
    return data;
  };

  const register = async (name, email, password) => {
    return await api.register(name, email, password);
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // continue even if logout API fails
    }
    setUser(null);
  };

  const value = { user, loading, login, register, logout, checkAuth };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
