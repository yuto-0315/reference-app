import React, { useState, useEffect } from 'react';
import packageInfo from '../../package.json';
import UpdateGuideModal from './UpdateGuideModal';
import { CHANGELOG } from '../utils/changelog';
import { History } from 'lucide-react';

const STORAGE_KEY = 'referenceApp:lastSeenVersion';

const VersionInfo = () => {
  const [showChangelog, setShowChangelog] = useState(false);

  // 更新日は変更履歴の最新版から取り、日付の書き換え忘れを防ぐ
  // 時刻を付けないとUTCとして解釈され、日本より西のタイムゾーンでは前日になる
  const updateDate = new Date(`${CHANGELOG[0].date}T00:00:00`).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      // ?changelog または ?update 付きで開いたときは常に表示する
      // （SNS で共有したリンクに付く ?fbclid= などでは表示しない）
      const force = params.has('changelog') || params.has('update');

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
        {/* キーボードでも開けるよう、div ではなく button にする */}
        <button type="button" className="version-badge" onClick={() => setShowChangelog(true)}>
          <span className="version-label">v{packageInfo.version}</span>
          <span className="update-date">最終更新: {updateDate}</span>
          <span className="changelog-hint"><History size={14} />変更履歴</span>
        </button>
      </div>
      
      <UpdateGuideModal
        isOpen={showChangelog}
        onClose={handleClose}
      />
    </>
  );
};

export default VersionInfo;
