import React, { useState } from 'react';
import infoIcon from '../png/info.png';

const InfoTooltip = ({ description, example, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);

  // 説明文も例もない場合は何も表示しない
  if (!description && !example) {
    return null;
  }

  return (
    <div className={`info-tooltip-container ${className}`}>
      <img
        src={infoIcon}
        alt="情報"
        className="info-icon"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      />
      {isVisible && (
        <div className="info-tooltip">
          {description && (
            <div className="info-description">
              {description}
            </div>
          )}
          {example && (
            <div className="info-example">
              <div className="info-example-label">例:</div>
              <div className="info-example-content">{example}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;
