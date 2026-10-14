import { useEffect } from 'react';

// モーダルなどを Esc キーで閉じられるようにする（マウスを使わなくても、いつでも元の画面に戻れるように）
const useEscapeKey = (isActive, onEscape) => {
  useEffect(() => {
    if (!isActive) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onEscape();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onEscape]);
};

export default useEscapeKey;
