import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

const normalizeRole = (value) => {
  if (!value) return 'student';
  return String(value).toLowerCase();
};

const normalizeUserPayload = (payload, fallbackRole = 'student') => {
  if (!payload) return null;

  const baseUser = payload.user || payload;
  const role = normalizeRole(payload.role || baseUser?.role || fallbackRole);

  if (payload.user) {
    return {
      ...payload,
      ...baseUser,
      role,
      user: {
        ...baseUser,
        role
      }
    };
  }

  return {
    ...payload,
    ...baseUser,
    role
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          const rememberedRole = localStorage.getItem('selectedRole');
          setUser(normalizeUserPayload(data, rememberedRole));
        } catch (error) {
          console.error("Failed to authenticate token", error);
          localStorage.removeItem('token');
          localStorage.removeItem('selectedRole');
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const selectedRole = normalizeUserPayload(data, localStorage.getItem('selectedRole'))?.role || 'student';
    localStorage.setItem('token', data.token);
    localStorage.setItem('selectedRole', selectedRole);
    setUser(normalizeUserPayload(data, selectedRole));
    return data;
  };

  const register = async (name, email, password, role) => {
    const selectedRole = normalizeRole(role);
    const { data } = await api.post('/auth/register', { name, email, password, role: selectedRole });
    localStorage.setItem('token', data.token);
    localStorage.setItem('selectedRole', selectedRole);
    setUser(normalizeUserPayload(data, selectedRole));
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedRole');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
