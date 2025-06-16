import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes, THEME_STORAGE_KEY } from '../utils/themes';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    // ローカルストレージからテーマを読み込み
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // テーマが変更されたらローカルストレージに保存
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
    
    // CSS変数を設定
    const theme = themes[currentTheme];
    const root = document.documentElement;
    
    // カラーパレットをCSS変数として設定
    Object.entries(theme.colors).forEach(([key, value]) => {
      if (typeof value === 'object') {
        // ネストされたオブジェクト（text, borderなど）
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--color-${key}-${subKey}`, subValue);
        });
      } else {
        // 直接の色値
        root.style.setProperty(`--color-${key}`, value);
      }
    });
  }, [currentTheme]);

  const switchTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const value = {
    currentTheme,
    theme: themes[currentTheme],
    availableThemes: Object.keys(themes).map(key => ({
      key,
      name: themes[key].name
    })),
    switchTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
