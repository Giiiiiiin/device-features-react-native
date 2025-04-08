import React, { createContext, useState, ReactNode, useContext } from 'react';

export interface Theme {
  background: string;
  cardBackground: string;
  text: string;
  dominant: string;
  accent: string;
}

const lightTheme: Theme = {
  background: '#FFFFFF',      
  cardBackground: '#F5F5F5',    
  text: '#333333',
  dominant: '#2196F3',
  accent: '#FF5722',          
};

const darkTheme: Theme = {
  background: '#121212',      
  cardBackground: '#1E1E1E',    
  text: '#FFFFFF',
  dominant: '#0D47A1',
  accent: '#FF5722',          
};

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface GlobalContextProviderProps {
  children: ReactNode;
}

export const GlobalContextProvider = ({ children }: GlobalContextProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a GlobalContextProvider');
  }
  return context;
};
