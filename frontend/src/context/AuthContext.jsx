import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { MOCK_USER_STUDENT, MOCK_USER_ADMIN } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const res = await api.get('/auth/me');
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.warn("Backend auth check offline or token expired");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = res.data;
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      if (err.response) {
        return { 
          success: false, 
          error: err.response.data?.detail || 'Invalid email or password.' 
        };
      }
      // Server offline fallback for dev mode
      if (email.toLowerCase().includes('admin')) {
        const mockAdminToken = 'mock-admin-jwt-token';
        setToken(mockAdminToken);
        setUser(MOCK_USER_ADMIN);
        localStorage.setItem('token', mockAdminToken);
        localStorage.setItem('user', JSON.stringify(MOCK_USER_ADMIN));
        return { success: true, user: MOCK_USER_ADMIN, isMock: true };
      } else {
        const mockStudentUser = { ...MOCK_USER_STUDENT, email: email || 'student@campus.edu' };
        const mockToken = 'mock-student-jwt-token';
        setToken(mockToken);
        setUser(mockStudentUser);
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockStudentUser));
        return { success: true, user: mockStudentUser, isMock: true };
      }
    }
  };

  const loginWithToken = async (newToken) => {
    try {
      setToken(newToken);
      localStorage.setItem('token', newToken);
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${newToken}` }
      });
      if (res.data) {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        return { success: true, user: res.data };
      }
      return { success: false, error: 'Failed to fetch user profile' };
    } catch (err) {
      console.error('Error fetching user profile with token:', err);
      // Fallback for dev mode if backend profile endpoint is offline
      const mockUser = MOCK_USER_STUDENT;
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true, user: mockUser, isMock: true };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { access_token, user: userData } = res.data;
      setToken(access_token);
      setUser(userData);
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      if (err.response) {
        return { 
          success: false, 
          error: err.response.data?.detail || 'Registration failed. Please try again.' 
        };
      }
      // Server offline fallback
      const newMockUser = {
        id: Date.now(),
        name,
        email,
        role: 'student',
        created_at: new Date().toISOString()
      };
      const mockToken = 'mock-registered-jwt-token';
      setToken(mockToken);
      setUser(newMockUser);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(newMockUser));
      return { success: true, user: newMockUser, isMock: true };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginWithToken,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
