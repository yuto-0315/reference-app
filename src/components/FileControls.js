import React from 'react';

const FileControls = ({ onExport, onImport, referenceCount }) => {
  return (
    <div className="file-controls">
      <h2 className="section-title">ファイル操作</h2>
      
      <div className="button-group">
        <button 
          className="btn btn-success"
          onClick={onExport}
          disabled={referenceCount === 0}
          title={referenceCount === 0 ? '参考文献がありません' : 'JSONファイルとしてエクスポート'}
        >
          💾 JSONエクスポート ({referenceCount}件)
        </button>
        
        <label className="file-input-label">
          📂 JSONインポート
          <input
            type="file"
            accept=".json"
            onChange={onImport}
            className="file-input"
          />
        </label>
      </div>
      
      <div style={{ 
        fontSize: '14px', 
        color: '#898AC4', 
        marginTop: '15px',
        padding: '15px',
        backgroundColor: '#FFF2E0',
        borderRadius: '6px',
        border: '1px solid #C0C9EE'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#898AC4' }}>💡 使い方のヒント</h4>
        <ul style={{ margin: 0, paddingLeft: '20px' }}>
          <li><strong>自動保存:</strong> 入力した内容は自動的にブラウザに保存されます</li>
          <li><strong>エクスポート:</strong> データをJSONファイルとしてバックアップできます</li>
          <li><strong>インポート:</strong> JSONファイルから文献データを追加で読み込めます（上書きではなく追加）</li>
          <li><strong>コピー機能:</strong> 各文献の「引用」「参考文献」ボタンでクリップボードにコピーできます</li>
        </ul>
      </div>
    </div>
  );
};

export default FileControls;
