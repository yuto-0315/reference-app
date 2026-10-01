import React, { useState } from 'react';
import { formatReference, formatCitation, migrateReferenceData, addYearSuffixes, getAuthorDisplayName, getSortReading, getPublicationYear, REFERENCE_TYPES } from '../utils/formatters';

const PreviewSection = ({ references, checkedReferences, onCopy, onToggleCheck, onToggleAll, onBulkCheck }) => {
  const [citationPage, setCitationPage] = useState('');
  const [selectedRef, setSelectedRef] = useState('');
  const [sortBy, setSortBy] = useState('year'); // 'author', 'year', 'title'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // 文献種別ごとの一括選択
  const handleSelectByType = (type) => {
    if (!type) return;
    const idsToSelect = references
      .filter(ref => migrateReferenceData(ref).type === type)
      .map(ref => ref.id);

    if (onBulkCheck) {
      onBulkCheck(idsToSelect);
    }
  };

  // チェックされた参考文献のみを取得し、ソート
  const getCheckedReferences = () => {
    return references
      .filter(ref => checkedReferences.has(ref.id))
      .map(ref => migrateReferenceData(ref));
  };

  const sortedReferences = [...getCheckedReferences()].sort((a, b) => {
    let compareValue = 0;
    const compareYear = () => (Number(getPublicationYear(a)) || 0) - (Number(getPublicationYear(b)) || 0);
    const compareReading = () => getSortReading(a).localeCompare(getSortReading(b), 'ja');

    switch (sortBy) {
      case 'author':
        // 著者名が同じ場合は発行年で比較（第二ソートキー）
        compareValue = compareReading() || compareYear();
        break;
      case 'year':
        // 年が同じ場合は読み仮名で比較（第二ソートキー）
        compareValue = compareYear() || compareReading();
        break;
      default:
        compareValue = 0;
    }

    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  const generateReferenceList = () => {
    // チェックされた参考文献にアルファベットサフィックスを付与
    const referencesWithSuffixes = addYearSuffixes(sortedReferences);
    return referencesWithSuffixes
      .map(ref => formatReference(ref))
      .join('\n');
  };

  // 同一著者・同一年の文献に対してアルファベットサフィックスを付与（保存値ではなく毎回計算する）
  const allReferencesWithSuffixes = addYearSuffixes(references);

  const generateCitation = () => {
    const ref = references.find(r => r.id === selectedRef);
    if (!ref) return '';
    const migratedRef = migrateReferenceData(ref);

    const refWithSuffix = allReferencesWithSuffixes.find(r => r.id === selectedRef) || migratedRef;

    // 引用ページが設定されていない場合は掲載ページを使用
    const pageToUse = citationPage || migratedRef.pages || '';

    return formatCitation(refWithSuffix, pageToUse);
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
        {/* 文字色をテーマ変数にしないと、ダークテーマで背景と同化して見えなくなる */}
        <h3 style={{ fontSize: '1.2rem', marginBottom: '15px', color: 'var(--color-text-onSurface)' }}>
          📝 本文中の引用（割注）
        </h3>

        <div className="form-group">
          <label htmlFor="citation-reference">参考文献を選択</label>
          <select
            id="citation-reference"
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
          <label htmlFor="citation-page">引用ページ（オプション）</label>
          <input
            id="citation-page"
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
          <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-text-onSurface)' }}>
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

            <select
              className="btn btn-small btn-secondary"
              style={{ marginLeft: '10px', backgroundColor: '#f8f9fa', color: '#333', borderColor: '#ddd' }}
              onChange={(e) => {
                handleSelectByType(e.target.value);
                e.target.value = ""; // Reset after selection
              }}
              disabled={references.length === 0}
            >
              <option value="">種類で一括選択...</option>
              {Object.keys(REFERENCE_TYPES).filter(type =>
                references.some(ref => migrateReferenceData(ref).type === type)
              ).map(type => (
                <option key={type} value={type}>
                  {REFERENCE_TYPES[type]}のみ選択
                </option>
              ))}
            </select>
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
              {/* addYearSuffixes の結果は移行済みデータで、計算したサフィックスを持つ */}
              {allReferencesWithSuffixes.map(ref => {
                const authorName = getAuthorDisplayName(ref);

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
                          {ref.type === 'translation' ? (
                            // 翻訳書の場合は「原著出版年(翻訳書出版年)」で表示
                            `${ref.originalYear || ''}(${ref.year || ''})年`
                          ) : ref.type === 'website' ? (
                            // Webサイトは最終閲覧日を表示
                            ref.yearSuffix ? `${ref.accessDate || '-'} (${ref.yearSuffix})` : (ref.accessDate || '-')
                          ) : (
                            `${getPublicationYear(ref) || ''}年`
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
