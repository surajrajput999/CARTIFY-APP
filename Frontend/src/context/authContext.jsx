import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the Authentication Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 2. Check localStorage for existing session on initial application load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user'); // Retrieve user data from memory
    
    if (token && storedUser) {
      setUser(JSON.parse(storedUser)); // If exists, set the user as logged in
    }
  }, []);

  // 3. Login function to save user data and token securely
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  // 4. Logout function to clear user session and data
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Custom Hook for easy access to AuthContext across the application
export const useAuth = () => useContext(AuthContext);