import React, { useState } from 'react';
import useEscapeKey from '../hooks/useEscapeKey';

const InfoTooltip = ({ description, example, fieldLabel = '', className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  useEscapeKey(isModalOpen, closeModal);

  // 説明文も例もない場合は何も表示しない
  if (!description && !example) {
    return null;
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <>
      <div className={`info-tooltip-container ${className}`}>
        {/* キーボードでも開けるよう button にする。フォーム内にあるため type="button" で送信を防ぐ */}
        <button
          type="button"
          className="info-icon"
          onClick={() => setIsModalOpen(true)}
          title="入力ガイドを表示"
          aria-label={fieldLabel ? `${fieldLabel}の入力ガイドを表示` : '入力ガイドを表示'}
        >
          i
        </button>
      </div>

      {isModalOpen && (
        <div className="info-modal-overlay" onClick={handleOverlayClick}>
          <div className="info-modal" role="dialog" aria-modal="true" aria-labelledby="info-modal-title" onClick={(e) => e.stopPropagation()}>
            <div className="info-modal-header">
              <h3 id="info-modal-title" className="info-modal-title">
                {fieldLabel ? `入力ガイド：${fieldLabel}` : '入力ガイド'}
              </h3>
              <button type="button" className="info-modal-close" onClick={closeModal} aria-label="閉じる">
                ×
              </button>
            </div>
            <div className="info-modal-content">
              {description && (
                <div className="info-description">
                  {description}
                </div>
              )}
              {example && (
                <div className="info-example">
                  <div className="info-example-label">入力例:</div>
                  <div className="info-example-content">{example}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InfoTooltip;
