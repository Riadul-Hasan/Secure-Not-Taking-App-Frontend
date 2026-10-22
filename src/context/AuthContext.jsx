import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import api, { getToken, setToken } from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      const next = res.data?.data || null;
      setUserState(next);
      return next;
    } catch {
      setUserState(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getToken()) {
      setLoading(false);
      return;
    }
    refreshUser();
  }, [refreshUser]);

  const patchUser = useCallback((patch) => {
    if (!patch) return;
    setUserState((prev) => (prev ? { ...prev, ...patch } : { ...patch }));
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const data = res.data?.data;
    if (data?.token) setToken(data.token);
    setUserState(data);
    setLoading(false);
    return data;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await api.post('/auth/register', payload);
    const data = res.data?.data;
    if (data?.token) setToken(data.token);
    setUserState(data);
    setLoading(false);
    return data;
  }, []);

  const logout = useCallback(async () => {
    setToken(null);
    setUserState(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser: setUserState,
      patchUser,
      refreshUser,
      login,
      register,
      logout,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
    }),
    [user, patchUser, refreshUser, login, register, logout, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside an <AuthProvider>');
  return ctx;
};

export default AuthContext;
