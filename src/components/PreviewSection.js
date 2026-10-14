import React, { useState } from 'react';
import { formatReference, migrateReferenceData, addYearSuffixes, getSortReading, getPublicationYear, REFERENCE_TYPES } from '../utils/formatters';
import { ArrowDown, ArrowUp, ArrowUpDown, Copy } from 'lucide-react';

// 一覧でチェックした文献を、提出用の参考文献一覧の形式で並べて出力する
// （選ぶのは一覧のチェック、本文中の引用は一覧の「引用」に任せ、ここは出力だけに絞る）
const PreviewSection = ({ references, checkedReferences, onCopy, onToggleAll, onBulkCheck }) => {
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

  // 削除・クリーンアップで消えた文献のIDがチェック状態に残っていても、件数に数えない
  const checkedCount = references.filter(ref => checkedReferences.has(ref.id)).length;

  // 登録されている文献の種類だけを一括選択の候補にする。
  // 選んでいた種類の文献がすべて削除されたら、未選択に戻す（押すと全部のチェックが外れてしまうため）
  const availableTypes = Object.keys(REFERENCE_TYPES).filter(type =>
    references.some(ref => migrateReferenceData(ref).type === type)
  );
  const effectiveBulkSelectType = availableTypes.includes(bulkSelectType) ? bulkSelectType : '';

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortIcon = (field) => {
    // 矢印は読み上げないため、並び順は文字でも伝える
    if (sortBy !== field) return <ArrowUpDown size={14} className="sort-icon" />;
    return sortOrder === 'asc'
      ? <><ArrowUp size={14} className="sort-icon" /><span className="visually-hidden">（昇順）</span></>
      : <><ArrowDown size={14} className="sort-icon" /><span className="visually-hidden">（降順）</span></>;
  };

  return (
    <div>
      <h2 className="section-title">参考文献一覧の出力</h2>
      <p className="preview-lead">下の一覧の左端でチェックした文献を、提出用の形式で並べます。</p>

      {/* 参考文献一覧 */}
      <div>
        <div style={{ marginBottom: '15px' }}>
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
                value={effectiveBulkSelectType}
                onChange={(e) => setBulkSelectType(e.target.value)}
                disabled={references.length === 0}
              >
                <option value="">種類で一括選択...</option>
                {availableTypes.map(type => (
                  <option key={type} value={type}>
                    {REFERENCE_TYPES[type]}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="btn btn-small btn-secondary"
                onClick={() => handleSelectByType(effectiveBulkSelectType)}
                disabled={!effectiveBulkSelectType}
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
              著者名{getSortIcon('author')}
            </button>
            <button
              className={`sort-btn ${sortBy === 'year' ? 'active' : ''}`}
              onClick={() => handleSort('year')}
            >
              発行年{getSortIcon('year')}
            </button>
          </div>
        )}

        {references.length === 0 ? (
          <div className="preview-area">
            まだ参考文献がありません。「新しい参考文献を追加」のフォームから登録すると、ここで参考文献一覧を作れます。
          </div>
        ) : (
          <>
            {/* プレビュー */}
            {checkedCount > 0 ? (
              <>
                <div className="preview-area">
                  {generateReferenceList()}
                </div>
                <button
                  className="btn btn-accent"
                  onClick={() => onCopy(generateReferenceList(), '参考文献一覧をコピーしました')}
                >
                  <Copy size={16} />選択した参考文献一覧をコピー ({checkedCount}件)
                </button>
              </>
            ) : (
              <div className="preview-area">
                下の一覧で文献にチェックを入れると、ここに参考文献一覧が表示されます。「全て選択」ですべて出すこともできます。
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PreviewSection;
