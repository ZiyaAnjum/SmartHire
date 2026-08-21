import React, { createContext, useState, useEffect } from 'react';

// Create the Context object
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage on component mount to retrieve stored credentials
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed && typeof parsed === 'object') {
          setToken(storedToken);
          setUser(parsed);
        }
      }
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save token and user info on successful login/signup
  // Supports (userData, jwtToken) or (jwtToken, userData)
  const login = (param1, param2) => {
    let userData = null;
    let jwtToken = null;

    if (typeof param1 === 'string' && typeof param2 === 'object') {
      jwtToken = param1;
      userData = param2;
    } else if (typeof param1 === 'object' && typeof param2 === 'string') {
      userData = param1;
      jwtToken = param2;
    } else if (typeof param1 === 'string') {
      jwtToken = param1;
      userData = param2 || null;
    } else {
      userData = param1 || null;
      jwtToken = param2 || null;
    }

    if (jwtToken) {
      localStorage.setItem('token', jwtToken);
      setToken(jwtToken);
    }
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  // Update user profile in context state and localStorage
  const updateUser = (newUserData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newUserData };
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    });
  };

  // Clear credentials on logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        loginUser: login, // Aliased for seamless compatibility
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

