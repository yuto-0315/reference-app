import React, { useState } from 'react';
import useDialog from '../hooks/useDialog';
import { Info, X } from 'lucide-react';

const InfoTooltip = ({ description, example, fieldLabel = '', className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => setIsModalOpen(false);
  const dialogRef = useDialog(isModalOpen, closeModal);

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
          <Info size={16} />
        </button>
      </div>

      {isModalOpen && (
        <div className="modal-overlay info-modal-overlay" onClick={handleOverlayClick}>
          <div ref={dialogRef} className="modal-content info-modal" role="dialog" aria-modal="true" aria-labelledby="info-modal-title" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 id="info-modal-title">
                {fieldLabel ? `入力ガイド：${fieldLabel}` : '入力ガイド'}
              </h2>
              <button type="button" className="modal-close" onClick={closeModal} aria-label="閉じる">
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
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
