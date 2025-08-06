import React, { useState } from 'react';
import packageInfo from '../../package.json';
import ChangelogModal from './ChangelogModal';

const VersionInfo = () => {
  const [showChangelog, setShowChangelog] = useState(false);

  const updateDate = new Date('2025-08-06').toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <div className="version-info">
        <div className="version-badge" onClick={() => setShowChangelog(true)}>
          <span className="version-label">v{packageInfo.version}</span>
          <span className="update-date">最終更新: {updateDate}</span>
          <span className="changelog-hint">📝 変更履歴</span>
        </div>
      </div>
      
      <ChangelogModal 
        isOpen={showChangelog} 
        onClose={() => setShowChangelog(false)} 
      />
    </>
  );
};

export default VersionInfo;
