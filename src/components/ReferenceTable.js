import React, { useState, useMemo, useCallback } from 'react';
import CitationPopover from './CitationPopover';
import { toDoiHref, toSafeHref } from '../utils/safeUrl';
import { formatCitation, formatReference, migrateReferenceData, addYearSuffixes, getSortReading, getPublicationYear, buildSortReadingLookup } from '../utils/formatters';
import { collectReadingGroups } from '../utils/bulkEdit';
import { ArrowDown, ArrowUp, ArrowUpDown, ArrowUpToLine, BookText, CopyPlus, ExternalLink, Languages, ListChecks, Pencil, Quote, TriangleAlert, Trash2 } from 'lucide-react';

// 著者・団体・作曲者の名前と読み、書誌情報をまとめた検索対象テキスト
const titleOf = (ref) => ref.title || '（タイトルなし）';

const getSearchableText = (migratedRef) => {
  const people = [
    ...(migratedRef.authors || []),
    ...(migratedRef.originalAuthors || []),
    ...(migratedRef.originalAuthorsEnglish || []),
  ];
  return [
    // 姓名を続けて入力しても見つかるよう、連結した氏名も含める
    ...people.flatMap(person => [`${person.lastName || ''}${person.firstName || ''}`, person.reading]),
    migratedRef.organization,
    migratedRef.organizationReading,
    migratedRef.composer,
    migratedRef.title,
    migratedRef.publisher,
    migratedRef.journalName,
    getPublicationYear(migratedRef),
  ].filter(Boolean).join('\n').toLowerCase();
};

// 著者名順の並べ替えに使う読み仮名が未登録か（英語文献は姓の綴りで並ぶので対象外）
const isReadingMissing = (migratedRef) => {
  const type = migratedRef.type;
  if (type.startsWith('english-')) return false;
  if (type === 'organization-book' || type === 'website') return !migratedRef.organizationReading;
  if (type === 'translation') {
    // 原著者が未登録の場合も、並べ替えの手がかりがないため未登録として示す
    return !migratedRef.originalAuthors?.[0]?.reading;
  }
  // 作曲者だけの楽譜などは読み仮名の入力欄がないため、著者がいる場合に限って見る
  if (migratedRef.authors && migratedRef.authors.length > 0) return !migratedRef.authors[0].reading;
  return false;
};

const ReferenceTable = ({ references, onEdit, onDelete, onCopy, onToggleCheck, checkedReferences, onOpenReadingBulk, onOpenBulkEdit, onDuplicate, recentlyUpdatedId, onShowOutput }) => {
  // 削除した文献のチェックが残っていても数えない
  const checkedCount = references.filter(ref => checkedReferences.has(ref.id)).length;
  const missingReadingNameCount = useMemo(() => collectReadingGroups(references).filter(group => group.isMissing).length, [references]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyMissingReading, setShowOnlyMissingReading] = useState(false);
  const [sortBy, setSortBy] = useState('year'); // 'year', 'reading', 'title'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // 同一著者・同一年の文献にアルファベットサフィックスを付与
  // 検索で絞り込んだ一覧ではなく全件で計算しないと、検索するたびにa,b,cが変わってしまう
  const suffixedReferenceById = useMemo(
    () => new Map(addYearSuffixes(references).map(ref => [ref.id, ref])),
    [references]
  );

  const readingLookup = useMemo(() => buildSortReadingLookup(references), [references]);

  // 検索とソート機能
  const filteredAndSortedReferences = useMemo(() => {
    // 「山田 1996」のように空白で区切った語は、すべてを含む文献を探す（全角の空白も区切りとして扱う）
    const searchWords = searchTerm.toLowerCase().split(/[\s　]+/).filter(Boolean);
    let filtered = references.filter(ref => {
      const migratedRef = migrateReferenceData(ref);
      if (showOnlyMissingReading && !isReadingMissing(migratedRef)) return false;
      const searchableText = getSearchableText(migratedRef);
      return searchWords.every(word => searchableText.includes(word));
    });
    const compareReading = (refA, refB) => getSortReading(refA, readingLookup).localeCompare(getSortReading(refB, readingLookup), 'ja');

    // ソート処理
    filtered.sort((a, b) => {
      const migratedA = migrateReferenceData(a);
      const migratedB = migrateReferenceData(b);
      let compareValue = 0;

      switch (sortBy) {
        case 'year': {
          // 年のない文献（Webサイトなど）は、昇順・降順どちらでも最後に置く
          const yearA = Number(getPublicationYear(migratedA)) || 0;
          const yearB = Number(getPublicationYear(migratedB)) || 0;
          if ((yearA === 0) !== (yearB === 0)) return yearA === 0 ? 1 : -1;
          // 年が同じ場合は読み仮名で比較（第二ソートキー）
          compareValue = yearA - yearB || compareReading(migratedA, migratedB);
          break;
        }
        case 'reading':
          // 筆頭著者の読み仮名または姓で比較、団体出版本・Webサイトの場合は団体名
          compareValue = compareReading(migratedA, migratedB);
          break;
        case 'title':
          // 手で編集したJSONで数値が入っていても落ちないよう、文字列にして比べる
          const aTitle = String(a.title || '');
          const bTitle = String(b.title || '');
          compareValue = aTitle.localeCompare(bTitle, 'ja');
          break;
        default:
          compareValue = 0;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return filtered;
  }, [references, readingLookup, searchTerm, showOnlyMissingReading, sortBy, sortOrder]);

  const isFiltered = searchTerm.trim() !== '' || showOnlyMissingReading;
  const allVisibleChecked = filteredAndSortedReferences.length > 0 && filteredAndSortedReferences.every(ref => checkedReferences.has(ref.id));
  const someVisibleChecked = filteredAndSortedReferences.some(ref => checkedReferences.has(ref.id));

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

  // ページを指定する引用は、ボタンの下に開く入力欄で完成形を確かめてからコピーする
  const [citationTargetId, setCitationTargetId] = useState(null);
  const closeCitationPopover = useCallback(({ restoreFocus }) => {
    const triggerId = citationTargetId;
    setCitationTargetId(null);
    // キーボードで操作していた人が、押したボタンの位置を見失わないようにする
    if (restoreFocus) document.querySelector(`[data-citation-trigger="${triggerId}"]`)?.focus();
  }, [citationTargetId]);

  // 削除したボタンと一緒にフォーカスが消えないよう、次の行（最後なら前の行）の削除ボタンへ移す
  const deleteAndKeepFocus = (id) => {
    const index = filteredAndSortedReferences.findIndex(ref => ref.id === id);
    const neighbor = filteredAndSortedReferences[index + 1] || filteredAndSortedReferences[index - 1];
    onDelete(id);
    requestAnimationFrame(() => {
      const target = neighbor && document.querySelector(`[data-delete-for="${neighbor.id}"]`);
      (target || document.querySelector('.search-input'))?.focus();
    });
  };

  const copyFormatted = (ref, type) => {
    // 同一著者・同一年の文献に対してアルファベットサフィックスを付与
    const refWithSuffix = suffixedReferenceById.get(ref.id) || ref;
    if (type === 'citation') {
      // Webサイトの引用にはページがないため、そのままコピーする
      if (ref.type === 'website') {
        const text = formatCitation(refWithSuffix, '');
        onCopy(text, `引用をコピーしました\n${text}`);
        return;
      }
      setCitationTargetId(current => (current === ref.id ? null : ref.id));
      return;
    }
    onCopy(formatReference(refWithSuffix), '参考文献をコピーしました');
  };

  // DOI があれば DOI のリンク、なければ URL。http(s) 以外のURLはリンクにしない
  const getExternalLink = (ref) => toDoiHref(ref.doi) || toSafeHref(ref.url);

  return (
    <section className="reference-table-container" aria-labelledby="reference-table-title">
      <h2 className="section-title" id="reference-table-title">登録した参考文献</h2>
      <div className="table-controls">
        <div className="search-container">
          <input
            type="search"
            placeholder="著者名・タイトル・年などで検索（空白で区切ると、すべてを含む文献）"
            aria-label="参考文献を検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' && searchTerm) {
                e.stopPropagation();
                setSearchTerm('');
              }
            }}
            className="search-input"
          />
        </div>

        {/* 出力欄の並べ替えと同じ順に並べ、どちらでも同じ位置に同じボタンがあるようにする */}
        <div className="sort-controls" role="group" aria-label="一覧の並べ替え">
          <span className="sort-label" aria-hidden="true">並べ替え:</span>
          {[['reading', '著者名'], ['year', '発行年'], ['title', 'タイトル']].map(([field, label]) => (
            <button
              key={field}
              type="button"
              className={`sort-btn ${sortBy === field ? 'active' : ''}`}
              aria-pressed={sortBy === field}
              onClick={() => handleSort(field)}
            >
              {label}{getSortIcon(field)}
            </button>
          ))}
        </div>
      </div>

      <div className="table-info">
        <span className="table-filter">
          全 {references.length} 件中 {filteredAndSortedReferences.length} 件を表示
          <label className="table-filter-toggle">
            <input
              type="checkbox"
              checked={showOnlyMissingReading}
              onChange={(e) => setShowOnlyMissingReading(e.target.checked)}
            />
            読み仮名が未登録の文献だけ表示
          </label>
        </span>
        <div className="bulk-actions">
          <button type="button" className="btn btn-secondary btn-small" onClick={onOpenReadingBulk} disabled={references.length === 0}>
            <Languages size={14} />読み仮名をまとめて登録
            {missingReadingNameCount > 0 && <span className="count-badge">未登録の名前 {missingReadingNameCount}</span>}
          </button>
          {/* 「何をまとめて変えるか」より先に「どれを」を選んでもらう（チェックしてから押す） */}
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={onOpenBulkEdit}
            disabled={checkedCount === 0}
            aria-describedby={checkedCount === 0 ? 'bulk-edit-hint' : undefined}
          >
            <ListChecks size={14} />チェックした文献をまとめて編集（{checkedCount}件）
          </button>
          {checkedCount === 0 && (
            <span id="bulk-edit-hint" className="bulk-actions-hint">左端のチェックで文献を選ぶと使えます</span>
          )}
          {/* チェックした結果（参考文献一覧）は画面の上の出力欄に出るため、そこへすぐ移れるようにする */}
          {checkedCount > 0 && onShowOutput && (
            <button type="button" className="btn btn-secondary btn-small" onClick={onShowOutput}>
              <ArrowUpToLine size={14} />出力欄で{checkedCount}件の参考文献一覧を見る
            </button>
          )}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="reference-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                {/* 検索や絞り込みで見えていない文献まで勝手にチェックしないよう、表示中の文献だけを対象にする */}
                <input
                  type="checkbox"
                  ref={(element) => {
                    if (element) element.indeterminate = someVisibleChecked && !allVisibleChecked;
                  }}
                  checked={allVisibleChecked}
                  disabled={filteredAndSortedReferences.length === 0}
                  onChange={(e) => {
                    filteredAndSortedReferences.forEach(ref => {
                      if (checkedReferences.has(ref.id) !== e.target.checked) onToggleCheck(ref.id);
                    });
                  }}
                  aria-label={isFiltered ? '表示中の文献をすべて参考文献一覧に含める／外す' : 'すべての文献を参考文献一覧に含める／外す'}
                />
              </th>
              <th>著者</th>
              <th>タイトル</th>
              <th>発行年</th>
              <th>出版社・雑誌</th>
              <th>リンク</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const referencesWithSuffixes = filteredAndSortedReferences.map(ref => suffixedReferenceById.get(ref.id));

              return referencesWithSuffixes.map((ref) => {
                const migratedRef = migrateReferenceData(ref);

                const isMissingReading = isReadingMissing(migratedRef);

                const rowTitle = isMissingReading ? '読み仮名が未登録です。正しく並べ替えるために編集して読み仮名を入力してください。' : '';

                return (
                  <tr
                    key={ref.id}
                    id={`reference-row-${ref.id}`}
                    className={[
                      isMissingReading && 'row-missing-reading',
                      ref.id === recentlyUpdatedId && 'row-recently-updated'
                    ].filter(Boolean).join(' ')}
                    title={rowTitle}
                  >
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={checkedReferences.has(ref.id)}
                        onChange={() => onToggleCheck(ref.id)}
                        aria-label={`「${ref.title}」を参考文献一覧に含める`}
                      />
                    </td>
                    <td className="author-cell">
                      <div className="author-name">
                        {migratedRef.type === 'translation' ? (
                          // 翻訳書の場合は原語表記の原著者を表示
                          migratedRef.originalAuthorsEnglish?.length > 0 ? (
                            migratedRef.originalAuthorsEnglish.map((author, index) => (
                              <div key={index} className="author-entry">
                                <div className="author-name-text">
                                  {author.lastName}, {author.firstName}
                                </div>
                              </div>
                            ))
                          ) : migratedRef.originalAuthors?.length > 0 ? (
                            migratedRef.originalAuthors.map((author, index) => (
                              <div key={index} className="author-entry">
                                <div className="author-name-text">
                                  {author.lastName}{author.firstName}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="author-entry">
                              <div className="author-name-text">
                                {migratedRef.originalAuthorLastName || '-'}
                              </div>
                            </div>
                          )
                        ) : (migratedRef.type === 'organization-book' || migratedRef.type === 'website') ? (
                          <div className="author-entry">
                            <div className="author-name-text">
                              {migratedRef.organization || '-'}
                            </div>
                            {migratedRef.organizationReading && (
                              <div className="author-reading">({migratedRef.organizationReading})</div>
                            )}
                          </div>
                        ) : migratedRef.authors?.length > 0 ? (
                          migratedRef.authors.map((author, index) => (
                            <div key={index} className="author-entry">
                              <div className="author-name-text">
                                {author.lastName}{author.firstName}
                              </div>
                              {author.reading && (
                                <div className="author-reading">({author.reading})</div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="author-entry">
                            <div className="author-name-text">
                              {migratedRef.composer || migratedRef.organization || '-'}
                            </div>
                          </div>
                        )}
                      </div>
                      {/* 行の色だけに頼らず、文字でも未登録であることを示す */}
                      {isMissingReading && (
                        <div className="missing-reading-note">
                          <TriangleAlert size={14} />読み仮名未登録
                          {/* 未登録に気づいたその場から、同じ名前の文献ごとまとめて登録できるようにする */}
                          <button type="button" className="missing-reading-action" onClick={onOpenReadingBulk}>まとめて登録</button>
                        </div>
                      )}
                    </td>
                    <td className="title-cell">
                      <div className="title-text">{ref.title}</div>
                    </td>
                    <td className="year-cell">
                      {(() => {
                        let yearDisplay;
                        if (migratedRef.type === 'translation') {
                          // 翻訳書の場合は「原著出版年(翻訳書出版年)」で表示
                          if (ref.yearSuffix) {
                            yearDisplay = `${migratedRef.originalYear || ''}(${ref.year || ''}${ref.yearSuffix})`;
                          } else {
                            yearDisplay = `${migratedRef.originalYear || ''}(${ref.year || ''})`;
                          }
                        } else if (migratedRef.type === 'website') {
                          // Webサイトは最終閲覧日とサフィックスを表示
                          const date = ref.accessDate || '-';
                          yearDisplay = ref.yearSuffix ? `${date} (${ref.yearSuffix})` : date;
                        } else {
                          yearDisplay = `${getPublicationYear(ref) || ''}${ref.yearSuffix || ''}`;
                        }
                        return yearDisplay;
                      })()}
                    </td>
                    <td className="publisher-cell">
                      {ref.publisher || ref.journalName || '-'}
                    </td>
                    <td className="link-cell">
                      {getExternalLink(ref) ? (
                        <a
                          href={getExternalLink(ref)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="external-link"
                          title={toDoiHref(ref.doi) ? `DOI: ${ref.doi}` : 'リンクを開く'}
                          aria-label={toDoiHref(ref.doi) ? `「${titleOf(ref)}」のDOI ${ref.doi} を新しいタブで開く` : `「${titleOf(ref)}」のリンクを新しいタブで開く`}
                        >
                          <ExternalLink size={16} className="icon-alone" />
                        </a>
                      ) : (
                        <span className="no-link">-</span>
                      )}
                    </td>
                    <td className="actions-cell">
                      {citationTargetId === ref.id && (
                        <CitationPopover
                          reference={suffixedReferenceById.get(ref.id) || migratedRef}
                          onCopy={onCopy}
                          onClose={closeCitationPopover}
                        />
                      )}
                      <div className="action-buttons">
                        {/* よく使うコピーは文字付きで大きく、編集・複製・削除は見慣れたアイコンだけにして行の高さを抑える */}
                        <div className="action-row">
                          <button
                            onClick={() => copyFormatted(migratedRef, 'citation')}
                            className="btn btn-sm btn-accent"
                            title="引用形式でコピー(割注)"
                            aria-label={`「${titleOf(ref)}」の引用（割注）をコピー`}
                            aria-haspopup={migratedRef.type === 'website' ? undefined : 'dialog'}
                            aria-expanded={migratedRef.type === 'website' ? undefined : citationTargetId === ref.id}
                            data-citation-trigger={ref.id}
                          >
                            <Quote size={14} />引用
                          </button>
                          <button
                            onClick={() => copyFormatted(migratedRef, 'reference')}
                            className="btn btn-sm btn-accent"
                            title="参考文献形式でコピー"
                            aria-label={`「${titleOf(ref)}」の参考文献の形式をコピー`}
                          >
                            <BookText size={14} />文献
                          </button>
                        </div>
                        <div className="action-row">
                          <button
                            onClick={() => onEdit(migratedRef)}
                            className="btn btn-sm btn-secondary btn-icon"
                            title="編集"
                            aria-label={`「${titleOf(ref)}」を編集`}
                          >
                            <Pencil size={16} className="icon-alone" />
                          </button>
                          <button
                            onClick={() => onDuplicate(migratedRef)}
                            className="btn btn-sm btn-secondary btn-icon"
                            title="複製（この文献の内容を追加フォームに入れて、似た文献を追加する）"
                            aria-label={`「${titleOf(ref)}」を複製して追加フォームに入れる`}
                          >
                            <CopyPlus size={16} className="icon-alone" />
                          </button>
                          <button
                            onClick={() => deleteAndKeepFocus(ref.id)}
                            className="btn btn-sm btn-danger btn-icon"
                            title="削除（あとから元に戻せます）"
                            aria-label={`「${titleOf(ref)}」を削除`}
                            data-delete-for={ref.id}
                          >
                            <Trash2 size={16} className="icon-alone" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      </div>

      {filteredAndSortedReferences.length === 0 && (
        <div className="empty-table">
          {showOnlyMissingReading && references.length > 0
            ? '読み仮名が未登録の文献はありません（検索語を入れている場合は、その中に未登録がありません）。'
            : searchTerm
            ? `「${searchTerm}」に一致する参考文献はありません。著者名・タイトル・出版社・発行年などで探せます。`
            : '参考文献がまだありません。上の「新しい参考文献を追加」フォームから登録してください。'}
        </div>
      )}
    </section>
  );
};

export default ReferenceTable;
