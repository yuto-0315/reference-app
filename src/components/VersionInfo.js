import React, { useState, useEffect } from 'react';
import packageInfo from '../../package.json';
import UpdateGuideModal from './UpdateGuideModal';

const STORAGE_KEY = 'referenceApp:lastSeenVersion';

const VersionInfo = () => {
  const [showChangelog, setShowChangelog] = useState(false);

  const updateDate = new Date('2025-09-03').toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      // force show if any query param present (e.g., ?changelog=1 or ?update)
      const force = params.toString() !== '';

      const lastSeen = localStorage.getItem(STORAGE_KEY);
      const current = packageInfo.version;

      if (force) {
        setShowChangelog(true);
        return;
      }

      if (!lastSeen || lastSeen !== current) {
        setShowChangelog(true);
      }
    } catch (e) {
      // ignore storage errors
      setShowChangelog(true);
    }
  }, []);

  const handleClose = () => {
    try {
      localStorage.setItem(STORAGE_KEY, packageInfo.version);
    } catch (e) {
      // ignore
    }
    setShowChangelog(false);
  };

  return (
    <>
      <div className="version-info">
        <div className="version-badge" onClick={() => setShowChangelog(true)}>
          <span className="version-label">v{packageInfo.version}</span>
          <span className="update-date">最終更新: {updateDate}</span>
          <span className="changelog-hint">📝 変更履歴</span>
        </div>
      </div>
      
      <UpdateGuideModal
        isOpen={showChangelog}
        onClose={handleClose}
      />
    </>
  );
};

export default VersionInfo;
