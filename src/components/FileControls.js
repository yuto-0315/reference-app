import React from 'react';

const FileControls = ({ onExport, onImport, onCleanup, referenceCount }) => {
  return (
    <div className="file-controls">
      <h2 className="section-title">ファイル操作</h2>

      <div className="button-group">
        <button
          type="button"
          className="btn btn-success"
          onClick={onExport}
          disabled={referenceCount === 0}
          title={referenceCount === 0 ? '参考文献がありません' : 'JSONファイルとしてエクスポート'}
        >
          💾 JSONエクスポート ({referenceCount}件)
        </button>

        {/* display: none だとキーボードで選べないため、見た目だけ隠してラベルをボタンとして見せる */}
        <label className="file-input-label">
          📂 JSONインポート
          <input
            type="file"
            accept=".json"
            onChange={onImport}
            className="visually-hidden"
          />
        </label>

        <button
          type="button"
          className="btn btn-warning"
          onClick={onCleanup}
          disabled={referenceCount === 0}
          title={referenceCount === 0 ? '参考文献がありません' : '重複データを除去して整理'}
        >
          🧹 データクリーンアップ
        </button>
      </div>

      {/* 初めての人向けの説明は、必要なときに開けるようにして普段は画面を広く使う */}
      <details className="usage-tips">
        <summary>💡 使い方のヒント</summary>
        <ul>
          <li><strong>自動保存:</strong> 入力した内容は自動的にブラウザに保存されます</li>
          <li><strong>エクスポート:</strong> データをJSONファイルとしてバックアップできます</li>
          <li><strong>インポート:</strong> JSONファイルから文献データを追加で読み込めます（重複は自動除去）</li>
          <li><strong>クリーンアップ:</strong> 重複データや不正なデータを自動で除去・整理します</li>
          <li><strong>コピー機能:</strong> 一覧の「📋 引用」で本文中の引用（割注）、「📖 文献」で参考文献の形式をクリップボードにコピーできます</li>
        </ul>
      </details>
    </div>
  );
};

export default FileControls;
