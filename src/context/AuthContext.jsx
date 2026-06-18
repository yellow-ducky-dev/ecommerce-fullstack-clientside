import React, { createContext, useContext, useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [authLoaded, setAuthLoaded] = useState(false);

  /* restore session on mount */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ecom_user');
      if (stored) setUser(JSON.parse(stored));
    } catch { localStorage.removeItem('ecom_user'); }
    finally { setAuthLoaded(true); }
  }, []);

  const saveUser = (data) => {
    localStorage.setItem('ecom_user', JSON.stringify(data));
    setUser(data);
  };

  /* ── register ── */
  const register = async (name, email, password) => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${API}/api/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      saveUser(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ── login ── */
  const login = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${API}/api/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      saveUser(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* ── logout ── */
  const logout = () => {
    localStorage.removeItem('ecom_user');
    setUser(null);
    setError('');
  };

  /* ── update profile ── */
  const updateProfile = async (updates) => {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch(`${API}/api/auth/profile`, {
        method:  'PUT',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${user?.token}`,
        },
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');
      saveUser(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, authLoaded, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;