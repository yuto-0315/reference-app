// 最後に JSON をエクスポート（バックアップ）した日時と、そのときの内容の指紋を覚えておく。
// データはブラウザの中にしかないため、消える前にバックアップを促すのに使う
const BACKUP_STORAGE_KEY = 'referenceApp:lastBackup';

// 内容が変わったかを見分けるための短い指紋（暗号用途ではない）
export const fingerprintReferences = (references) => {
  const text = JSON.stringify(references);
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) hash = ((hash * 33) ^ text.charCodeAt(i)) >>> 0;
  return `${text.length}-${hash.toString(36)}`;
};

export const readLastBackup = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(BACKUP_STORAGE_KEY));
    return saved && saved.exportedAt ? saved : null;
  } catch (error) {
    return null;
  }
};

export const saveLastBackup = (references) => {
  const backup = { exportedAt: new Date().toISOString(), fingerprint: fingerprintReferences(references) };
  try {
    localStorage.setItem(BACKUP_STORAGE_KEY, JSON.stringify(backup));
  } catch (error) {
    // 覚えておけなくてもエクスポート自体はできている
  }
  return backup;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// 「今日」「昨日」「3日前」のように、日付の数字より経過が分かる言い方にする
export const describeElapsedDays = (isoDate, now = new Date()) => {
  const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(new Date(isoDate))) / MS_PER_DAY);
  if (days <= 0) return '今日';
  if (days === 1) return '昨日';
  return `${days}日前`;
};
