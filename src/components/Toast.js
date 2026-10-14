import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CircleCheck, X } from 'lucide-react';

const Toast = ({ message, isVisible, onClose }) => {
  const [show, setShow] = useState(false);
  const fadeTimerRef = useRef(null);

  // フェードアウトアニメーション後にクリアする。
  // 直後に次のトーストが出たとき、前のタイマーで新しいトーストまで消さないよう、タイマーを覚えておく
  const hideAfterFade = useCallback(() => {
    setShow(false);
    clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    if (isVisible && message) {
      clearTimeout(fadeTimerRef.current);
      setShow(true);
      // 自動的に2.5秒後に閉じる
      const timer = setTimeout(hideAfterFade, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, message, hideAfterFade]);

  useEffect(() => () => clearTimeout(fadeTimerRef.current), []);

  if (!message) return null;

  return (
    <div className={`toast ${show ? 'toast-show' : ''}`} role="status">
      <div className="toast-content">
        <CircleCheck size={20} className="toast-icon" />
        <span className="toast-message">
          {message.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i < message.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </span>
        <button
          type="button"
          className="toast-close"
          onClick={hideAfterFade}
          aria-label="閉じる"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
