import React from 'react';
import { CHANGELOG, CHANGE_TYPE_LABELS, CHANGE_TYPE_ICONS } from '../utils/changelog';

const ChangelogModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content changelog-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📝 変更履歴</h2>
          <button className="btn btn-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="changelog-content">
            {CHANGELOG.map((version, index) => (
              <div key={version.version} className="version-section">
                <div className="version-header">
                  <div className="version-info">
                    <h3 className="version-number">v{version.version}</h3>
                    <span className="version-date">{formatDate(version.date)}</span>
                  </div>
                  {index === 0 && <span className="latest-badge">最新</span>}
                </div>
                
                <div className="changes-list">
                  {version.changes.map((change, changeIndex) => (
                    <div key={changeIndex} className={`change-item change-${change.type}`}>
                      <span className="change-icon">
                        {CHANGE_TYPE_ICONS[change.type]}
                      </span>
                      <div className="change-content">
                        <span className="change-type">
                          {CHANGE_TYPE_LABELS[change.type]}
                        </span>
                        <span className="change-description">
                          {change.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={onClose}>
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangelogModal;
