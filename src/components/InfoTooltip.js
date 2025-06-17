import React, { useState } from 'react';

const InfoTooltip = ({ description, example, className = '' }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // デバッグ用ログ
  console.log('InfoTooltip props:', { description, example });

  // 説明文も例もない場合は何も表示しない
  if (!description && !example) {
    console.log('InfoTooltip: No description or example, returning null');
    return null;
  }

  const openModal = () => {
    console.log('InfoTooltip: Opening modal');
    setIsModalOpen(true);
  };
  const closeModal = () => {
    console.log('InfoTooltip: Closing modal');
    setIsModalOpen(false);
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
        <div className="info-modal-overlay" onClick={closeModal}>
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
