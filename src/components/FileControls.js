import React from 'react';
import { CircleCheck, Download, Eraser, Lightbulb, TriangleAlert, Upload } from 'lucide-react';
import { describeElapsedDays } from '../utils/backupStatus';

// データはこのブラウザの中にしかないため、バックアップの状態を常に見えるところに出す
const BackupStatus = ({ lastBackup, hasChangesSinceBackup, referenceCount }) => {
  if (referenceCount === 0) return null;
  if (!lastBackup) {
    return (
      <p className="backup-status needs-backup">
        <TriangleAlert size={16} />まだバックアップしていません。データはこのブラウザの中だけにあるため、「JSONエクスポート」で保存しておくと安心です
      </p>
    );
  }
  const elapsed = describeElapsedDays(lastBackup.exportedAt);
  if (hasChangesSinceBackup) {
    return (
      <p className="backup-status needs-backup">
        <TriangleAlert size={16} />最後のバックアップ：{elapsed}（そのあと変更があります。「JSONエクスポート」で保存し直してください）
      </p>
    );
  }
  return (
    <p className="backup-status">
      <CircleCheck size={16} />最後のバックアップ：{elapsed}（今の内容と同じです）
    </p>
  );
};

const FileControls = ({ onExport, onImport, onCleanup, referenceCount, lastBackup, hasChangesSinceBackup }) => {
  return (
    <div className="file-controls">
      <h2 className="section-title">ファイル操作</h2>

      <div className="button-group">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onExport}
          disabled={referenceCount === 0}
          title={referenceCount === 0 ? '参考文献がありません' : 'JSONファイルとしてエクスポート'}
        >
          <Download size={16} />JSONエクスポート ({referenceCount}件)
        </button>

        {/* display: none だとキーボードで選べないため、見た目だけ隠してラベルをボタンとして見せる */}
        <label className="file-input-label">
          <Upload size={16} />JSONインポート
          <input
            type="file"
            accept=".json"
            onChange={onImport}
            className="visually-hidden"
          />
        </label>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCleanup}
          disabled={referenceCount === 0}
          title={referenceCount === 0 ? '参考文献がありません' : '重複データを除去して整理'}
        >
          <Eraser size={16} />データクリーンアップ
        </button>
      </div>

      <BackupStatus lastBackup={lastBackup} hasChangesSinceBackup={hasChangesSinceBackup} referenceCount={referenceCount} />

      {/* 初めての人向けの説明は、必要なときに開けるようにして普段は画面を広く使う */}
      <details className="usage-tips">
        <summary><Lightbulb size={16} />使い方のヒント</summary>
        <ul>
          <li><strong>自動保存:</strong> 入力した内容は自動的にブラウザに保存されます</li>
          <li><strong>エクスポート:</strong> データをJSONファイルとしてバックアップできます</li>
          <li><strong>インポート:</strong> JSONファイルから文献データを追加で読み込めます（重複は自動除去）</li>
          <li><strong>クリーンアップ:</strong> 重複データや不正なデータを自動で除去・整理します</li>
          <li><strong>まとめて登録・編集:</strong> 一覧の上の「読み仮名をまとめて登録」で、同じ団体名・著者名の読み仮名を1回の入力で登録できます。一覧でチェックした文献は「チェックした文献をまとめて編集」で、出版社や発行年などをまとめて同じ値にできます</li>
          <li><strong>コピー機能:</strong> 一覧の「引用」で本文中の引用（割注）、「文献」で参考文献の形式をクリップボードにコピーできます</li>
        </ul>
      </details>
    </div>
  );
};

export default FileControls;
