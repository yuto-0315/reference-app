import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { themes } from '../utils/themes';
import useEscapeKey from '../hooks/useEscapeKey';
import { Check, Palette, X } from 'lucide-react';

// 画面のどこにどの色が使われるかを、カードの色見本で左から順に示す
const SWATCH_ROLES = [
  { label: '背景', pick: colors => colors.background },
  { label: 'ヘッダー', pick: colors => colors.secondary },
  { label: 'メインのボタン', pick: colors => colors.primary },
  { label: 'コピーのボタン', pick: colors => colors.accent },
  { label: '見出しの文字', pick: colors => colors.text.primary }
];

const ThemeSwatches = ({ colors }) => (
  <span className="theme-swatches" aria-hidden="true">
    {SWATCH_ROLES.map(role => (
      <span key={role.label} className="theme-swatch" style={{ background: role.pick(colors) }} />
    ))}
  </span>
);

// 配色が百種類以上あるため、名前だけのドロップダウンではなく、色見本を見比べながら選べる一覧にする
const ThemePickerModal = ({ onClose }) => {
  const { currentTheme, themeGroups, switchTheme } = useTheme();
  const bodyRef = useRef(null);
  useEscapeKey(true, onClose);

  // 開いたら選択中のカードまでスクロールし、矢印キーですぐ選び直せるようにする
  useEffect(() => {
    const selectedInput = bodyRef.current?.querySelector('input:checked');
    if (!selectedInput) return;
    selectedInput.closest('.theme-card').scrollIntoView({ block: 'center' });
    selectedInput.focus({ preventScroll: true });
  }, []);

  const scrollToGroup = (groupKey) => {
    document.getElementById(`theme-group-${groupKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content theme-picker-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-picker-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="theme-picker-title">テーマを選ぶ</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="閉じる"><X size={20} /></button>
        </div>

        <nav className="theme-group-nav" aria-label="系統へ移動">
          {themeGroups.map(group => (
            <button key={group.key} type="button" className="theme-group-link" onClick={() => scrollToGroup(group.key)}>
              {group.name}
            </button>
          ))}
        </nav>

        <div className="modal-body" ref={bodyRef}>
          <p className="theme-picker-hint">
            選ぶとすぐに画面に反映されます。色見本は左から {SWATCH_ROLES.map(role => role.label).join('・')} の色です。
          </p>
          {themeGroups.map(group => (
            <section key={group.key} id={`theme-group-${group.key}`} className="theme-group" aria-labelledby={`theme-group-title-${group.key}`}>
              <h3 id={`theme-group-title-${group.key}`} className="theme-group-title">
                {group.name}
                <span className="theme-group-count">{group.themeKeys.length}種類</span>
              </h3>
              <div className="theme-card-grid">
                {group.themeKeys.map(themeKey => {
                  const isSelected = themeKey === currentTheme;
                  return (
                    <label key={themeKey} className={`theme-card${isSelected ? ' is-selected' : ''}`}>
                      <input
                        type="radio"
                        name="theme"
                        value={themeKey}
                        checked={isSelected}
                        onChange={() => switchTheme(themeKey)}
                        className="visually-hidden"
                      />
                      <ThemeSwatches colors={themes[themeKey].colors} />
                      <span className="theme-card-name">{themes[themeKey].name}</span>
                      {isSelected && <span className="theme-card-current"><Check size={14} />選択中</span>}
                    </label>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
};

const ThemeToggle = () => {
  const { theme } = useTheme();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const toggleButtonRef = useRef(null);

  // 閉じたら開いたボタンへフォーカスを戻し、キーボード操作の位置を見失わないようにする
  const closePicker = () => {
    setIsPickerOpen(false);
    toggleButtonRef.current?.focus();
  };

  return (
    <>
      <button
        type="button"
        ref={toggleButtonRef}
        className="theme-toggle"
        onClick={() => setIsPickerOpen(true)}
        aria-haspopup="dialog"
      >
        <span className="theme-toggle-label"><Palette size={14} />テーマ</span>
        <span className="theme-toggle-current">
          <ThemeSwatches colors={theme.colors} />
          <span className="theme-toggle-name">{theme.name}</span>
        </span>
      </button>
      {isPickerOpen && <ThemePickerModal onClose={closePicker} />}
    </>
  );
};

export default ThemeToggle;
