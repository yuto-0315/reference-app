import React, { useState } from 'react';
import { formatReference, formatCitation, migrateReferenceData } from '../utils/formatters';

const PreviewSection = ({ references, checkedReferences, onCopy, onToggleCheck, onToggleAll }) => {
  const [citationPage, setCitationPage] = useState('');
  const [selectedRef, setSelectedRef] = useState('');

  // チェックされた参考文献のみを取得し、著者名でソート
  const getCheckedReferences = () => {
    return references
      .filter(ref => checkedReferences.has(ref.id))
      .map(ref => migrateReferenceData(ref));
  };

  const sortedReferences = [...getCheckedReferences()].sort((a, b) => {
    const getAuthorName = (ref) => {
      if (ref.type === 'translation') {
        return ref.originalAuthorLastName || '';
      }
      if (ref.authors && ref.authors.length > 0) {
        return ref.authors[0].lastName || '';
      }
      return ref.composer || ref.organization || '';
    };

    const authorA = getAuthorName(a);
    const authorB = getAuthorName(b);
    
    return authorA.localeCompare(authorB, 'ja');
  });

  const generateReferenceList = () => {
    return sortedReferences
      .map(ref => formatReference(ref))
      .join('\n\n');
  };

  const generateCitation = () => {
    const ref = references.find(r => r.id === selectedRef);
    if (!ref) return '';
    const migratedRef = migrateReferenceData(ref);
    return formatCitation(migratedRef, citationPage);
  };

  return (
    <div>
      <h2 className="section-title">プレビュー</h2>
      
      {/* 本文中の引用生成 */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#333' }}>
          📝 本文中の引用（割注）
        </h3>
        
        <div className="form-group">
          <label>参考文献を選択</label>
          <select
            value={selectedRef}
            onChange={(e) => setSelectedRef(e.target.value)}
          >
            <option value="">選択してください</option>
            {references.map(ref => {
              const migratedRef = migrateReferenceData(ref);
              const authorName = migratedRef.authors && migratedRef.authors.length > 0 
                ? `${migratedRef.authors[0].lastName}${migratedRef.authors[0].firstName}`
                : migratedRef.composer || migratedRef.organization || 'タイトルなし';
              
              return (
                <option key={ref.id} value={ref.id}>
                  {authorName} - {ref.title}
                </option>
              );
            })}
          </select>
        </div>
        
        <div className="form-group">
          <label>引用ページ（オプション）</label>
          <input
            type="text"
            value={citationPage}
            onChange={(e) => setCitationPage(e.target.value)}
            placeholder="例: 123, 123-125"
          />
        </div>
        
        {selectedRef && (
          <div className="preview-area">
            {generateCitation()}
          </div>
        )}
        
        {selectedRef && (
          <button
            className="btn btn-info"
            onClick={() => onCopy(generateCitation(), 'インライン引用をコピーしました')}
          >
            📝 引用をコピー
          </button>
        )}
      </div>

      {/* 参考文献一覧 */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
          <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#333' }}>
            📚 参考文献一覧
          </h3>
          <div className="reference-list-controls">
            <button
              className="btn btn-small btn-secondary"
              onClick={() => onToggleAll(true)}
              disabled={references.length === 0}
            >
              全て選択
            </button>
            <button
              className="btn btn-small btn-secondary"
              onClick={() => onToggleAll(false)}
              disabled={checkedReferences.size === 0}
            >
              全て解除
            </button>
            <span className="reference-count">
              {checkedReferences.size} / {references.length} 件選択
            </span>
          </div>
        </div>

        {references.length === 0 ? (
          <div className="preview-area">
            参考文献を追加すると、ここに選択肢が表示されます。
          </div>
        ) : (
          <>
            {/* 参考文献リスト（チェックボックス付き） */}
            <div className="reference-checklist">
              {references.map(ref => {
                const migratedRef = migrateReferenceData(ref);
                const authorName = migratedRef.authors && migratedRef.authors.length > 0 
                  ? `${migratedRef.authors[0].lastName}${migratedRef.authors[0].firstName}`
                  : migratedRef.composer || migratedRef.organization || 'タイトルなし';
                
                return (
                  <div key={ref.id} className="reference-check-item">
                    <label className="reference-checkbox-label">
                      <input
                        type="checkbox"
                        checked={checkedReferences.has(ref.id)}
                        onChange={() => onToggleCheck(ref.id)}
                        className="reference-checkbox"
                      />
                      <div className="reference-info">
                        <div className="reference-author">{authorName}</div>
                        <div className="reference-title">{ref.title}</div>
                        <div className="reference-year">{ref.year}年</div>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>

            {/* プレビュー */}
            {checkedReferences.size > 0 ? (
              <>
                <div className="preview-area">
                  {generateReferenceList()}
                </div>
                <button
                  className="btn btn-success"
                  onClick={() => onCopy(generateReferenceList(), '参考文献一覧をコピーしました')}
                >
                  📋 選択した参考文献一覧をコピー ({checkedReferences.size}件)
                </button>
              </>
            ) : (
              <div className="preview-area">
                参考文献にチェックを入れると、ここに一覧が表示されます。
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewSection;
