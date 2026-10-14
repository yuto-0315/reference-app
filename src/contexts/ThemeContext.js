import React, { createContext, useContext, useState, useLayoutEffect } from 'react';
import { themes, THEME_GROUPS, THEME_STORAGE_KEY, DEFAULT_THEME_KEY, LEGACY_THEME_KEYS } from '../utils/themes';

// 整理前の旧テーマが保存されていれば近い色のテーマに読み替え、不明なら既定のテーマにする
const resolveThemeKey = (savedKey) => {
  if (themes[savedKey]) return savedKey;
  return LEGACY_THEME_KEYS[savedKey] || DEFAULT_THEME_KEY;
};

// プライベートブラウズなどでストレージが使えなくても、アプリ全体を止めない
const readSavedThemeKey = () => {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY);
  } catch (error) {
    return null;
  }
};

const saveThemeKey = (themeKey) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeKey);
  } catch (error) {
    // 保存できなくても、表示中のテーマはそのまま使える
  }
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // ローカルストレージからテーマを読み込み
  // 初回描画前に読むことで、一瞬だけ既定テーマが表示されるちらつきをなくす
  const [currentTheme, setCurrentTheme] = useState(() => resolveThemeKey(readSavedThemeKey()));

  // 描画前に色を反映し、一瞬だけ既定の配色が見えるちらつきを防ぐ
  useLayoutEffect(() => {
    // テーマが変更されたらローカルストレージに保存
    saveThemeKey(currentTheme);

    // CSS変数を設定
    const theme = themes[currentTheme];
    const root = document.documentElement;
    // ダークテーマではセレクトの選択肢やスクロールバーなど、ブラウザ標準の部品も暗くする
    root.style.colorScheme = theme.colorScheme || 'light';

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
    themeGroups: THEME_GROUPS,
    switchTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
