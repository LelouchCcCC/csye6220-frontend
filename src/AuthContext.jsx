import { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
       .then(res => setUser(res.data))
       .catch(() => setUser(false))
       .finally(() => setLoading(false));
  }, []);
  

  const login  = (u) => setUser(u);
  const logout = () => { setUser(false); api.post('/auth/logout'); };

  return (
    <AuthCtx.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
