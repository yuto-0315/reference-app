import React, { useMemo, useState } from 'react';
import {
  formatReference, migrateReferenceData, addYearSuffixes, getSortReading, getPublicationYear, REFERENCE_TYPES,
  buildSortReadingLookup, isSortReadingMissing, getYearSuffixGroupKey
} from '../utils/formatters';
import { ArrowDown, ArrowUp, ArrowUpDown, Copy, TriangleAlert } from 'lucide-react';

// 年のない文献（Webサイトなど）は、昇順・降順どちらでも最後に置く
const yearOf = (reference) => {
  const year = Number(getPublicationYear(reference));
  return Number.isFinite(year) && year > 0 ? year : null;
};

// 一覧でチェックした文献を、提出用の参考文献一覧の形式で並べて出力する
// （選ぶのは一覧のチェック、本文中の引用は一覧の「引用」に任せ、ここは出力だけに絞る）
const PreviewSection = ({ references, checkedReferences, onCopy, onToggleAll, onBulkCheck }) => {
  // 参考文献一覧は著者名の五十音順に並べるのが基本なので、最初から著者名順にしておく
  const [sortBy, setSortBy] = useState('author'); // 'author', 'year'
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

  // a,b,c は一覧の「引用」と同じく登録済みの全文献で付ける（本文中の引用と参考文献一覧の記号を食い違わせない）
  const suffixById = useMemo(
    () => new Map(addYearSuffixes(references).map(ref => [ref.id, ref.yearSuffix || ''])),
    [references]
  );
  const readingLookup = useMemo(() => buildSortReadingLookup(references), [references]);
  const checkedList = getCheckedReferences();

  const sortedReferences = [...checkedList].sort((a, b) => {
    let compareValue = 0;
    const yearA = yearOf(a);
    const yearB = yearOf(b);
    const compareYear = () => (yearA ?? 0) - (yearB ?? 0);
    const compareReading = () => getSortReading(a, readingLookup).localeCompare(getSortReading(b, readingLookup), 'ja');
    if (sortBy === 'year' && (yearA === null) !== (yearB === null)) return yearA === null ? 1 : -1;

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

  const generateReferenceList = () => sortedReferences
    .map(ref => formatReference({ ...ref, yearSuffix: suffixById.get(ref.id) || '' }))
    .join('\n');

  // 提出前に気づきたいこと：読み仮名がなく五十音順に並ばない文献と、a・b の組の一部だけを選んでいる文献
  const missingReadingCount = checkedList.filter(ref => isSortReadingMissing(ref, readingLookup)).length;
  const checkedIds = new Set(checkedList.map(ref => ref.id));
  const partialSuffixCount = references.filter(ref =>
    suffixById.get(ref.id) && !checkedIds.has(ref.id)
    && checkedList.some(checked => suffixById.get(checked.id) && getYearSuffixGroupKey(checked) === getYearSuffixGroupKey(ref))
  ).length;

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
                {(missingReadingCount > 0 || partialSuffixCount > 0) && (
                  <ul className="preview-warnings">
                    {missingReadingCount > 0 && sortBy === 'author' && (
                      <li>
                        <TriangleAlert size={16} />
                        読み仮名のない文献が{missingReadingCount}件あり、五十音順の位置がずれることがあります。下の一覧の「読み仮名をまとめて登録」から登録できます。
                      </li>
                    )}
                    {partialSuffixCount > 0 && (
                      <li>
                        <TriangleAlert size={16} />
                        同じ著者・同じ年の文献のうち{partialSuffixCount}件を選んでいないため、a・b などの記号が飛んでいます。本文で使わない文献なら、一覧から削除すると記号が付け直されます。
                      </li>
                    )}
                  </ul>
                )}
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
