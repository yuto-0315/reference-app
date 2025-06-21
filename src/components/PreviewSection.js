import React, { useState } from 'react';
import { formatReference, formatCitation, migrateReferenceData } from '../utils/formatters';

const PreviewSection = ({ references, checkedReferences, onCopy, onToggleCheck, onToggleAll }) => {
  const [citationPage, setCitationPage] = useState('');
  const [selectedRef, setSelectedRef] = useState('');
  const [sortBy, setSortBy] = useState('year'); // 'author', 'year', 'title'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // 複数著者の表示用ユーティリティ関数
  const getAuthorDisplayName = (migratedRef) => {
    if (migratedRef.type === 'translation') {
      // 翻訳書の場合は原語表記の原著者を使用
      if (migratedRef.originalAuthorsEnglish && migratedRef.originalAuthorsEnglish.length > 0) {
        return migratedRef.originalAuthorsEnglish
          .map(author => `${author.lastName}, ${author.firstName}`)
          .join('; ');
      }
      // 新しい形式の翻訳書（日本語表記の原著者を使用）
      if (migratedRef.originalAuthors && migratedRef.originalAuthors.length > 0) {
        return migratedRef.originalAuthors
          .map(author => `${author.lastName}${author.firstName}`)
          .join('・');
      }
      // 古い形式の翻訳書（後方互換性）
      return migratedRef.originalAuthorLastName || '';
    }
    if (migratedRef.type === 'organization-book') {
      // 団体出版本の場合は執筆団体名を表示
      return migratedRef.organization || '';
    }
    if (migratedRef.authors && migratedRef.authors.length > 0) {
      return migratedRef.authors
        .map(author => `${author.lastName}${author.firstName}`)
        .join('・');
    }
    return migratedRef.composer || migratedRef.organization || '';
  };

  // チェックされた参考文献のみを取得し、ソート
  const getCheckedReferences = () => {
    return references
      .filter(ref => checkedReferences.has(ref.id))
      .map(ref => migrateReferenceData(ref));
  };

  const sortedReferences = [...getCheckedReferences()].sort((a, b) => {
    let compareValue = 0;
    
    switch (sortBy) {
      case 'author':
        const getAuthorName = (ref) => {
          if (ref.type === 'translation') {
            // 翻訳書の場合は原語表記の原著者を使用（ソート用）
            if (ref.originalAuthorsEnglish && ref.originalAuthorsEnglish.length > 0) {
              return ref.originalAuthorsEnglish[0].lastName || '';
            }
            // 新しい形式の翻訳書（日本語表記の原著者を使用）
            if (ref.originalAuthors && ref.originalAuthors.length > 0) {
              return ref.originalAuthors[0].lastName || '';
            }
            // 古い形式の翻訳書（後方互換性）
            return ref.originalAuthorLastName || '';
          }
          if (ref.type === 'organization-book') {
            // 団体出版本の場合は執筆団体名を使用
            return ref.organization || '';
          }
          if (ref.authors && ref.authors.length > 0) {
            return ref.authors[0].lastName || '';
          }
          return ref.composer || ref.organization || '';
        };
        const authorA = getAuthorName(a);
        const authorB = getAuthorName(b);
        compareValue = authorA.localeCompare(authorB, 'ja');
        break;
      case 'year':
        compareValue = (a.year || 0) - (b.year || 0);
        break;
      default:
        compareValue = 0;
    }
    
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  const generateReferenceList = () => {
    return sortedReferences
      .map(ref => formatReference(ref))
      .join('\n');
  };

  const generateCitation = () => {
    const ref = references.find(r => r.id === selectedRef);
    if (!ref) return '';
    const migratedRef = migrateReferenceData(ref);
    
    // 引用ページが設定されていない場合は掲載ページを使用
    const pageToUse = citationPage || migratedRef.pages || '';
    
    return formatCitation(migratedRef, pageToUse);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
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
              const authorName = getAuthorDisplayName(migratedRef);
              
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
            placeholder={(() => {
              if (selectedRef) {
                const ref = references.find(r => r.id === selectedRef);
                const migratedRef = ref ? migrateReferenceData(ref) : null;
                if (migratedRef?.pages) {
                  return `未入力時は掲載ページ「${migratedRef.pages}」を使用`;
                }
              }
              return "例: 123, 123-125";
            })()}
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

        {/* 並べ替えコントロール */}
        {checkedReferences.size > 1 && (
          <div className="sort-controls" style={{ marginBottom: '15px' }}>
            <span className="sort-label">並べ替え:</span>
            <button 
              className={`sort-btn ${sortBy === 'author' ? 'active' : ''}`}
              onClick={() => handleSort('author')}
            >
              著者名 {getSortIcon('author')}
            </button>
            <button 
              className={`sort-btn ${sortBy === 'year' ? 'active' : ''}`}
              onClick={() => handleSort('year')}
            >
              発行年 {getSortIcon('year')}
            </button>
          </div>
        )}

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
                const authorName = getAuthorDisplayName(migratedRef);
                
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
                        <div className="reference-year">
                          {migratedRef.type === 'translation' ? (
                            // 翻訳書の場合は「原著出版年(翻訳書出版年)」で表示
                            `${migratedRef.originalYear || ''}(${ref.year || ''})年`
                          ) : (
                            `${ref.year}年`
                          )}
                        </div>
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
