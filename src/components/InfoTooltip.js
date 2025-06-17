import React, { useState } from 'react';

const InfoTooltip = ({ description, example, className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 説明文も例もない場合は何も表示しない
  if (!description && !example) {
    return null;
  }

  const openModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };
  
  const closeModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal(e);
    }
  };

  return (
    <>
      <div className={`info-tooltip-container ${className}`}>
        <div
          className="info-icon"
          onClick={openModal}
          title="詳細情報を表示"
        >
          i
        </div>
      </div>
      
      {isModalOpen && (
        <div className="info-modal-overlay" onClick={handleOverlayClick}>
          <div className="info-modal" onClick={(e) => e.stopPropagation()}>
            <div className="info-modal-header">
              <h3 className="info-modal-title">入力ガイド</h3>
              <button className="info-modal-close" onClick={closeModal}>
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
