import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fake JWT Auth logic
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      // Decode mock...
      setUser({ id: 1, name: 'John Doe', email: 'john@example.com' });
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simulated auth
    const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock";
    localStorage.setItem('jwt_token', fakeToken);
    setUser({ id: 1, name: 'John Doe', email });
    return true;
  };

  const register = (name, email, password) => {
    const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock_reg";
    localStorage.setItem('jwt_token', fakeToken);
    setUser({ id: 1, name, email });
    return true;
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
