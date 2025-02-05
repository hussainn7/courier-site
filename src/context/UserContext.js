import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      return parsedUser.isLoggedIn ? parsedUser : null;
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      const userData = { ...user, isLoggedIn: true };
      localStorage.setItem('userData', JSON.stringify(userData));
    } else {
      const savedUser = localStorage.getItem('userData');
      if (savedUser) {
        const userData = { ...JSON.parse(savedUser), isLoggedIn: false };
        localStorage.setItem('userData', JSON.stringify(userData));
      }
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
} 