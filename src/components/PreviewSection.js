import React, { useState } from 'react';
import { formatReference, formatCitation } from '../utils/formatters';

const PreviewSection = ({ references, onCopy }) => {
  const [citationPage, setCitationPage] = useState('');
  const [selectedRef, setSelectedRef] = useState('');

  // 著者名でソート（日本語文献は五十音順、英語文献はアルファベット順）
  const sortedReferences = [...references].sort((a, b) => {
    const getAuthorName = (ref) => {
      if (ref.type === 'translation') {
        return ref.originalAuthorLastName || '';
      }
      return ref.authorLastName || ref.composer || ref.organization || '';
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
    return formatCitation(ref, citationPage);
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
            {references.map(ref => (
              <option key={ref.id} value={ref.id}>
                {(ref.authorLastName && ref.authorFirstName) ? 
                  `${ref.authorLastName}${ref.authorFirstName}` : 
                  (ref.originalAuthorLastName && ref.originalAuthorFirstName) ? 
                    `${ref.originalAuthorLastName}${ref.originalAuthorFirstName}` :
                    ref.composer || ref.organization || 'タイトルなし'} - {ref.title}
              </option>
            ))}
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
        <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#333' }}>
          📚 参考文献一覧
        </h3>
        
        {references.length === 0 ? (
          <div className="preview-area">
            参考文献を追加すると、ここに一覧が表示されます。
          </div>
        ) : (
          <>
            <div className="preview-area">
              {generateReferenceList()}
            </div>
            <button
              className="btn btn-success"
              onClick={() => onCopy(generateReferenceList(), '参考文献一覧をコピーしました')}
            >
              📋 参考文献一覧をコピー
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewSection;
