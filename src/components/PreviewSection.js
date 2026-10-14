import React, { useState } from 'react';
import { formatReference, formatCitation, migrateReferenceData, addYearSuffixes, getAuthorDisplayName, getSortReading, getPublicationYear, REFERENCE_TYPES } from '../utils/formatters';

const PreviewSection = ({ references, checkedReferences, onCopy, onToggleCheck, onToggleAll, onBulkCheck }) => {
  const [citationPage, setCitationPage] = useState('');
  const [selectedRef, setSelectedRef] = useState('');
  const [sortBy, setSortBy] = useState('year'); // 'author', 'year', 'title'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'
  const [bulkSelectType, setBulkSelectType] = useState('');

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

  // 選んでいた文献が削除された場合は、空の引用やコピーボタンを出さない
  const selectedReference = references.find(ref => ref.id === selectedRef);
  // 削除・クリーンアップで消えた文献のIDがチェック状態に残っていても、件数に数えない
  const checkedCount = references.filter(ref => checkedReferences.has(ref.id)).length;

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
            placeholder={selectedReference?.pages
              ? `未入力時は掲載ページ「${selectedReference.pages}」を使用`
              : '例: 123, 123-125'}
          />
        </div>

        {selectedReference && (
          <div className="preview-area">
            {generateCitation()}
          </div>
        )}

        {selectedReference && (
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
        {/* 幅が足りないときは操作ボタンを次の行に回し、見出しが途中で折り返されないようにする */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
          <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--color-text-onSurface)', whiteSpace: 'nowrap' }}>
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
              disabled={checkedCount === 0}
            >
              全て解除
            </button>
            <span className="reference-count">
              {checkedCount} / {references.length} 件選択
            </span>

            {/* 選んだ瞬間に反映すると、矢印キーで候補を移るたびに選択が変わってしまうため、ボタンで確定する */}
            <span className="type-select-group">
              <select
                className="type-select"
                aria-label="まとめて選択する文献の種類"
                value={bulkSelectType}
                onChange={(e) => setBulkSelectType(e.target.value)}
                disabled={references.length === 0}
              >
                <option value="">種類で一括選択...</option>
                {Object.keys(REFERENCE_TYPES).filter(type =>
                  references.some(ref => migrateReferenceData(ref).type === type)
                ).map(type => (
                  <option key={type} value={type}>
                    {REFERENCE_TYPES[type]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-small btn-secondary"
                onClick={() => handleSelectByType(bulkSelectType)}
                disabled={!bulkSelectType}
              >
                のみ選択
              </button>
            </span>
          </div>
        </div>

        {/* 並べ替えコントロール */}
        {checkedCount > 1 && (
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
            まだ参考文献がありません。「新しい参考文献を追加」のフォームから登録すると、ここで本文中の引用と参考文献一覧を作れます。
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
            {checkedCount > 0 ? (
              <>
                <div className="preview-area">
                  {generateReferenceList()}
                </div>
                <button
                  className="btn btn-success"
                  onClick={() => onCopy(generateReferenceList(), '参考文献一覧をコピーしました')}
                >
                  📋 選択した参考文献一覧をコピー ({checkedCount}件)
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
