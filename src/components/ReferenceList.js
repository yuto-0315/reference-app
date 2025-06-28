import React from 'react';
import { REFERENCE_TYPES, formatReference, formatCitation, migrateReferenceData, addYearSuffixes } from '../utils/formatters';

const ReferenceList = ({ references, onEdit, onDelete, onCopy }) => {
  if (references.length === 0) {
    return (
      <div className="reference-list">
        <h2 className="section-title">保存された参考文献</h2>
        <div className="empty-state">
          <p>まだ参考文献が登録されていません。</p>
          <p>上記のフォームから新しい参考文献を追加してください。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="reference-list">
      <h2 className="section-title">保存された参考文献 ({references.length}件)</h2>
      
      <div className="stats">
        <div className="stat-card">
          <div className="stat-number">{references.length}</div>
          <div className="stat-label">総文献数</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">
            {Object.keys(references.reduce((acc, ref) => {
              acc[ref.type] = true;
              return acc;
            }, {})).length}
          </div>
          <div className="stat-label">文献種別数</div>
        </div>
      </div>

      {(() => {
        // 同一著者・同一年の文献にアルファベットサフィックスを付与
        const referencesWithSuffixes = addYearSuffixes(references);
        
        return referencesWithSuffixes.map((reference) => {
          const migratedReference = migrateReferenceData(reference);
          return (
            <div key={reference.id} className="reference-item">
              <div className="reference-header">
                <span className="reference-type">
                  {REFERENCE_TYPES[reference.type]}
                </span>
                <div className="reference-actions">
                  <button
                    className="btn btn-info btn-small"
                    onClick={() => onCopy(formatCitation(migratedReference), 'インライン引用をコピーしました')}
                    title="インライン引用をコピー"
                  >
                    📝 引用
                  </button>
                  <button
                    className="btn btn-success btn-small"
                    onClick={() => onCopy(formatReference(migratedReference), '参考文献をコピーしました')}
                    title="参考文献をコピー"
                  >
                    📋 参考文献
                  </button>
                  <button
                    className="btn btn-secondary btn-small"
                    onClick={() => onEdit(migratedReference)}
                    title="編集"
                  >
                    ✏️ 編集
                  </button>
                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => onDelete(reference.id)}
                    title="削除"
                  >
                    🗑️ 削除
                  </button>
                </div>
              </div>
              
              <div className="reference-content">
                {formatReference(migratedReference)}
              </div>
              
              <div className="citation-preview">
                <strong>本文中の引用例:</strong> {formatCitation(migratedReference, 'XX')}
              </div>
              
              <div style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
                作成: {new Date(reference.createdAt).toLocaleString('ja-JP')}
                {reference.updatedAt !== reference.createdAt && (
                  <span> | 更新: {new Date(reference.updatedAt).toLocaleString('ja-JP')}</span>
                )}
              </div>
            </div>
          );
        });
      })()}
    </div>
  );
};

export default ReferenceList;
