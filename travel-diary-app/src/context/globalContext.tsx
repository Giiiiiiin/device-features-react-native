import React, { createContext, useContext, useState } from 'react';

const GlobalContext = createContext(null);

export const GlobalProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => setCart([...cart, item]);

  return (
    <GlobalContext.Provider value={{ cart, addToCart }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
