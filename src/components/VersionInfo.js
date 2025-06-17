import React from 'react';
import packageInfo from '../../package.json';

const VersionInfo = () => {
  // アプリケーションの更新日時 (2025年6月17日)
  const updateDate = new Date('2025-06-17').toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="version-info">
      <div className="version-badge">
        <span className="version-label">v{packageInfo.version}</span>
        <span className="update-date">最終更新: {updateDate}</span>
      </div>
    </div>
  );
};

export default VersionInfo;
