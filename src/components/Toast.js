import React, { useEffect, useState } from 'react';

const Toast = ({ message, isVisible, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible && message) {
      setShow(true);
      // 自動的に2.5秒後に閉じる
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // フェードアウトアニメーション後にクリア
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isVisible, message, onClose]);

  if (!message) return null;

  return (
    <div className={`toast ${show ? 'toast-show' : ''}`}>
      <div className="toast-content">
        <span className="toast-icon">✅</span>
        <span className="toast-message">{message}</span>
        <button 
          className="toast-close" 
          onClick={() => {
            setShow(false);
            setTimeout(onClose, 300);
          }}
          aria-label="閉じる"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;
