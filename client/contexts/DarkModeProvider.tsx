import React, { createContext } from 'react';
import { useTheme } from 'next-themes';
import { useEffectOnce } from 'usehooks-ts';

export interface IDarkModeContext {
  onSetTheme: (type: string | null) => void;
  theme?: string;
}

interface IDarkModeProvider {
  children: React.ReactNode;
}

export const DarkModeContext = createContext<IDarkModeContext>({} as IDarkModeContext);
const DarkModeProvider: React.FC<IDarkModeProvider> = ({ children }) => {
  const { theme, setTheme } = useTheme();
  
  useEffectOnce(() => {
    const localTheme = localStorage.getItem('theme');
    localTheme ? setTheme(localTheme) : setTheme('light');
  });
  
  const onSetTheme = (type: string | null) => {
    if (typeof type === 'string') {
      setTheme(type);
      localStorage.setItem('theme', type);
      return;
    }
    
    let newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  return (
    <DarkModeContext.Provider value={{ onSetTheme, theme }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export default DarkModeProvider;