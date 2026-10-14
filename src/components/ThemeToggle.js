import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../utils/themes';

// 配色が百種類以上あるため、色の系統を選んでから、その中の配色を選ぶ2段にする
const ThemeToggle = () => {
  const { currentTheme, currentGroup, themeGroups, switchTheme } = useTheme();

  // 系統を変えたら、その系統の最初の配色をすぐに当てて、選んだ結果が見えるようにする
  const handleGroupChange = (groupKey) => {
    const nextGroup = themeGroups.find(group => group.key === groupKey);
    if (nextGroup) switchTheme(nextGroup.themeKeys[0]);
  };

  return (
    <div className="theme-toggle">
      <div className="theme-field">
        <label htmlFor="theme-group" className="theme-toggle-label">🎨 テーマの系統</label>
        <select
          id="theme-group"
          value={currentGroup.key}
          onChange={(e) => handleGroupChange(e.target.value)}
          className="theme-select"
        >
          {themeGroups.map(group => (
            <option key={group.key} value={group.key}>
              {group.name}
            </option>
          ))}
        </select>
      </div>
      <div className="theme-field">
        <label htmlFor="theme-select" className="theme-toggle-label">配色</label>
        <select
          id="theme-select"
          value={currentTheme}
          onChange={(e) => switchTheme(e.target.value)}
          className="theme-select theme-select-palette"
        >
          {currentGroup.themeKeys.map(themeKey => (
            <option key={themeKey} value={themeKey}>
              {themes[themeKey].name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ThemeToggle;
