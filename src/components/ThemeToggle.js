import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
  const { currentTheme, availableThemes, switchTheme } = useTheme();

  return (
    <div className="theme-toggle">
      <label className="theme-toggle-label">
        🎨 テーマ:
      </label>
      <select
        value={currentTheme}
        onChange={(e) => switchTheme(e.target.value)}
        className="theme-select"
      >
        {availableThemes.map(theme => (
          <option key={theme.key} value={theme.key}>
            {theme.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ThemeToggle;
