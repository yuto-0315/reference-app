import React, { useState, useMemo } from 'react';
import { formatCitation, formatReference, migrateReferenceData, addYearSuffixes, getSortReading, getPublicationYear } from '../utils/formatters';
import { ArrowDown, ArrowUp, ArrowUpDown, BookText, ExternalLink, Pencil, Quote, TriangleAlert, Trash2 } from 'lucide-react';

// 著者・団体・作曲者の名前と読み、書誌情報をまとめた検索対象テキスト
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

const ReferenceTable = ({ references, onEdit, onDelete, onCopy, onToggleCheck, checkedReferences }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('year'); // 'year', 'reading', 'title'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // 同一著者・同一年の文献にアルファベットサフィックスを付与
  // 検索で絞り込んだ一覧ではなく全件で計算しないと、検索するたびにa,b,cが変わってしまう
  const suffixedReferenceById = useMemo(
    () => new Map(addYearSuffixes(references).map(ref => [ref.id, ref])),
    [references]
  );

  // 検索とソート機能
  const filteredAndSortedReferences = useMemo(() => {
    const searchLower = searchTerm.toLowerCase();
    let filtered = references.filter(ref => getSearchableText(migrateReferenceData(ref)).includes(searchLower));

    // ソート処理
    filtered.sort((a, b) => {
      const migratedA = migrateReferenceData(a);
      const migratedB = migrateReferenceData(b);
      let compareValue = 0;

      switch (sortBy) {
        case 'year':
          // use migrated values and coerce to Number to avoid string subtraction
          // website type might not have year, treating as 0 or handling appropriately
          const yearA = Number(getPublicationYear(migratedA)) || 0;
          const yearB = Number(getPublicationYear(migratedB)) || 0;
          compareValue = yearA - yearB;

          // 年が同じ場合は読み仮名で比較（第二ソートキー）
          if (compareValue === 0) {
            compareValue = getSortReading(migratedA).localeCompare(getSortReading(migratedB), 'ja');
          }
          break;
        case 'reading':
          // 筆頭著者の読み仮名または姓で比較、団体出版本・Webサイトの場合は団体名
          compareValue = getSortReading(migratedA).localeCompare(getSortReading(migratedB), 'ja');
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
  }, [references, searchTerm, sortBy, sortOrder]);

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

  const copyFormatted = (ref, type) => {
    if (type === 'citation') {

      let pageInput = ""
      if (ref.type === 'website') {

      } else {
        // 引用の場合はページ指定のプロンプトを表示
        pageInput = prompt(
          'ページを指定してください（例：45、45-58、45-58, 62）\n' +
          '空白にすると登録済みのページ情報を使用します：',
          ref.pages || ''
        );
      }

      // ユーザーがキャンセルした場合は処理を中止
      if (pageInput === null) return;

      // 同一著者・同一年の文献に対してアルファベットサフィックスを付与
      const refWithSuffix = suffixedReferenceById.get(ref.id) || ref;

      // 入力されたページまたは登録済みのページを使用
      const pageToUse = pageInput.trim() || ref.pages;
      const text = formatCitation(refWithSuffix, pageToUse);
      onCopy(text, `引用をコピーしました\n${text ? `${text}` : ''}`);
    } else {
      // 参考文献の場合もアルファベットサフィックスを付与
      const refWithSuffix = suffixedReferenceById.get(ref.id) || ref;
      const text = formatReference(refWithSuffix);
      onCopy(text, '参考文献をコピーしました');
    }
  };

  const getExternalLink = (ref) => {
    if (ref.doi) {
      return `https://doi.org/${ref.doi}`;
    }
    if (ref.url) {
      return ref.url;
    }
    return null;
  };

  return (
    <div className="reference-table-container">
      <div className="table-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="参考文献を検索..."
            aria-label="参考文献を検索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="sort-controls">
          <span className="sort-label">並べ替え:</span>
          <button
            className={`sort-btn ${sortBy === 'year' ? 'active' : ''}`}
            onClick={() => handleSort('year')}
          >
            発行年{getSortIcon('year')}
          </button>
          <button
            className={`sort-btn ${sortBy === 'reading' ? 'active' : ''}`}
            onClick={() => handleSort('reading')}
          >
            著者名{getSortIcon('reading')}
          </button>
          <button
            className={`sort-btn ${sortBy === 'title' ? 'active' : ''}`}
            onClick={() => handleSort('title')}
          >
            タイトル{getSortIcon('title')}
          </button>
        </div>
      </div>

      <div className="table-info">
        <span>全 {references.length} 件中 {filteredAndSortedReferences.length} 件を表示</span>
      </div>

      <div className="table-wrapper">
        <table className="reference-table">
          <thead>
            <tr>
              <th style={{ width: '40px', textAlign: 'center' }}>
                <input
                  type="checkbox"
                  checked={references.length > 0 && references.every(ref => checkedReferences.has(ref.id))}
                  onChange={(e) => {
                    if (e.target.checked) {
                      references.forEach(ref => {
                        if (!checkedReferences.has(ref.id)) {
                          onToggleCheck(ref.id);
                        }
                      });
                    } else {
                      references.forEach(ref => {
                        if (checkedReferences.has(ref.id)) {
                          onToggleCheck(ref.id);
                        }
                      });
                    }
                  }}
                  title="全て選択/解除"
                  aria-label="すべての参考文献を一覧に含める／外す"
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

                // 読み仮名が不足しているかチェック
                const isMissingReading = (() => {
                  const type = migratedRef.type;
                  if (type.startsWith('english-')) return false; // 英語文献は対象外

                  if (type === 'organization-book') {
                    // 団体出版本は「読み仮名」を必須とする
                    return !migratedRef.organizationReading;
                  }
                  if (type === 'website') {
                    // Webサイトも「読み仮名」を必須とする
                    return !migratedRef.organizationReading;
                  }
                  if (type === 'translation') {
                    if (migratedRef.originalAuthors && migratedRef.originalAuthors.length > 0) {
                      return !migratedRef.originalAuthors[0].reading;
                    }
                    // 原著者が未登録の場合はWarning
                    return true;
                  }
                  if (migratedRef.authors && migratedRef.authors.length > 0) {
                    return !migratedRef.authors[0].reading;
                  }
                  // 作曲者などのケース（現状のデータ構造だとauthorsがない場合もある？）
                  // 既存ロジックでは authors がない場合 composer を表示しているが、
                  // reading入力欄が作曲者にない場合はどうしようもないため、一旦 authors がある場合に限定するか、
                  // 厳密にはここも修正が必要だが、まずはユーザー指摘の「読み仮名入力」にフォーカス。
                  // authorsが空で composer がある場合、読み仮名フィールド自体がない可能性が高い。
                  // とりあえず authors があるのに reading がないケースを拾う。
                  return false;
                })();

                const rowTitle = isMissingReading ? '読み仮名が未登録です。正しく並べ替えるために編集して読み仮名を入力してください。' : '';

                return (
                  <tr key={ref.id} className={isMissingReading ? 'row-missing-reading' : ''} title={rowTitle}>
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
                        <div className="missing-reading-note"><TriangleAlert size={14} />読み仮名未登録</div>
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
                          title={ref.doi ? `DOI: ${ref.doi}` : 'リンクを開く'}
                          aria-label={ref.doi ? `DOI: ${ref.doi}（新しいタブで開く）` : 'リンクを新しいタブで開く'}
                        >
                          <ExternalLink size={16} className="icon-alone" />
                        </a>
                      ) : (
                        <span className="no-link">-</span>
                      )}
                    </td>
                    <td className="actions-cell">
                      <div className="action-buttons">
                        {/* アイコンだけだと意味が分からないため短い文字を添え、読み上げ用には詳しい説明を付ける */}
                        <button
                          onClick={() => copyFormatted(migratedRef, 'citation')}
                          className="btn btn-sm btn-accent"
                          title="引用形式でコピー(割注)"
                          aria-label="引用形式でコピー(割注)"
                        >
                          <Quote size={14} />引用
                        </button>
                        <button
                          onClick={() => copyFormatted(migratedRef, 'reference')}
                          className="btn btn-sm btn-accent"
                          title="参考文献形式でコピー"
                          aria-label="参考文献形式でコピー"
                        >
                          <BookText size={14} />文献
                        </button>
                        <button
                          onClick={() => onEdit(migratedRef)}
                          className="btn btn-sm btn-secondary"
                          title="編集"
                          aria-label="編集"
                        >
                          <Pencil size={14} />編集
                        </button>
                        <button
                          onClick={() => onDelete(ref.id)}
                          className="btn btn-sm btn-danger"
                          title="削除"
                          aria-label="削除"
                        >
                          <Trash2 size={14} />削除
                        </button>
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
          {searchTerm
            ? `「${searchTerm}」に一致する参考文献はありません。著者名・タイトル・出版社・発行年などで探せます。`
            : '参考文献がまだありません。上の「新しい参考文献を追加」フォームから登録してください。'}
        </div>
      )}
    </div>
  );
};

export default ReferenceTable;
