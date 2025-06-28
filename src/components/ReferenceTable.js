import React, { useState, useMemo } from 'react';
import { formatCitation, formatReference, migrateReferenceData, addYearSuffixes } from '../utils/formatters';

const ReferenceTable = ({ references, onEdit, onDelete, onCopy, onToggleCheck, checkedReferences }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('year'); // 'year', 'reading', 'title'
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

  // 検索とソート機能
  const filteredAndSortedReferences = useMemo(() => {
    let filtered = references.filter(ref => {
      const migratedRef = migrateReferenceData(ref);
      const searchLower = searchTerm.toLowerCase();
      
      // 複数著者に対応した検索
      const authorMatches = migratedRef.authors?.some(author => 
        author.lastName?.toLowerCase().includes(searchLower) ||
        author.firstName?.toLowerCase().includes(searchLower) ||
        author.reading?.toLowerCase().includes(searchLower)
      ) || false;
      
      // 団体出版本の場合は執筆団体名も検索対象に含める
      const organizationMatches = migratedRef.type === 'organization-book' && 
        migratedRef.organization?.toLowerCase().includes(searchLower);
      
      return (
        authorMatches ||
        organizationMatches ||
        ref.title?.toLowerCase().includes(searchLower) ||
        ref.publisher?.toLowerCase().includes(searchLower) ||
        ref.journalName?.toLowerCase().includes(searchLower) ||
        ref.year?.toString().includes(searchLower)
      );
    });

    // ソート処理
    filtered.sort((a, b) => {
      const migratedA = migrateReferenceData(a);
      const migratedB = migrateReferenceData(b);
      let compareValue = 0;
      
      switch (sortBy) {
        case 'year':
          compareValue = (a.year || 0) - (b.year || 0);
          break;
        case 'reading':
          // 筆頭著者の読み仮名または姓で比較、団体出版本の場合は団体名
          let aReading = '';
          let bReading = '';
          
          if (migratedA.type === 'organization-book') {
            aReading = migratedA.organization || '';
          } else {
            aReading = migratedA.authors?.[0]?.reading || migratedA.authors?.[0]?.lastName || '';
          }
          
          if (migratedB.type === 'organization-book') {
            bReading = migratedB.organization || '';
          } else {
            bReading = migratedB.authors?.[0]?.reading || migratedB.authors?.[0]?.lastName || '';
          }
          
          compareValue = aReading.localeCompare(bReading, 'ja');
          break;
        case 'title':
          const aTitle = a.title || '';
          const bTitle = b.title || '';
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
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const copyFormatted = (ref, type) => {
    if (type === 'citation') {
      // 引用の場合はページ指定のプロンプトを表示
      const pageInput = prompt(
        'ページを指定してください（例：45、45-58、45-58, 62）\n' +
        '空白にすると登録済みのページ情報を使用します：',
        ref.pages || ''
      );
      
      // ユーザーがキャンセルした場合は処理を中止
      if (pageInput === null) return;
      
      // 同一著者・同一年の文献に対してアルファベットサフィックスを付与
      const allReferencesWithSuffixes = addYearSuffixes(references);
      const refWithSuffix = allReferencesWithSuffixes.find(r => r.id === ref.id) || ref;
      
      // 入力されたページまたは登録済みのページを使用
      const pageToUse = pageInput.trim() || ref.pages;
      const text = formatCitation(refWithSuffix, pageToUse);
      onCopy(text, `引用をコピーしました${pageToUse ? ` (ページ: ${pageToUse})` : ''}`);
    } else {
      // 参考文献の場合もアルファベットサフィックスを付与
      const allReferencesWithSuffixes = addYearSuffixes(references);
      const refWithSuffix = allReferencesWithSuffixes.find(r => r.id === ref.id) || ref;
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
            placeholder="🔍 参考文献を検索..."
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
            発行年 {getSortIcon('year')}
          </button>
          <button 
            className={`sort-btn ${sortBy === 'reading' ? 'active' : ''}`}
            onClick={() => handleSort('reading')}
          >
            読み仮名 {getSortIcon('reading')}
          </button>
          <button 
            className={`sort-btn ${sortBy === 'title' ? 'active' : ''}`}
            onClick={() => handleSort('title')}
          >
            タイトル {getSortIcon('title')}
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
                  checked={checkedReferences.size > 0 && checkedReferences.size === references.length}
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
              // 同一著者・同一年の文献にアルファベットサフィックスを付与
              const referencesWithSuffixes = addYearSuffixes(filteredAndSortedReferences);
              
              return referencesWithSuffixes.map((ref) => {
                const migratedRef = migrateReferenceData(ref);
                return (
                  <tr key={ref.id}>
                    <td style={{ textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        checked={checkedReferences.has(ref.id)}
                        onChange={() => onToggleCheck(ref.id)}
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
                      ) : migratedRef.type === 'organization-book' ? (
                        <div className="author-entry">
                          <div className="author-name-text">
                            {migratedRef.organization || '-'}
                          </div>
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
                  </td>
                  <td className="title-cell">
                    <div className="title-text">{ref.title}</div>
                  </td>
                  <td className="year-cell">
                    {migratedRef.type === 'translation' ? (
                      // 翻訳書の場合は「原著出版年(翻訳書出版年)」で表示
                      ref.yearSuffix ? 
                        `${migratedRef.originalYear || ''}(${ref.year || ''}${ref.yearSuffix})` :
                        `${migratedRef.originalYear || ''}(${ref.year || ''})`
                    ) : (
                      ref.yearSuffix ? `${ref.year}${ref.yearSuffix}` : ref.year
                    )}
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
                      >
                        🔗
                      </a>
                    ) : (
                      <span className="no-link">-</span>
                    )}
                  </td>
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button
                        onClick={() => copyFormatted(migratedRef, 'citation')}
                        className="btn btn-sm btn-copy"
                        title="引用形式でコピー"
                      >
                        📋
                      </button>
                      <button
                        onClick={() => copyFormatted(migratedRef, 'reference')}
                        className="btn btn-sm btn-copy"
                        title="参考文献形式でコピー"
                      >
                        📖
                      </button>
                      <button
                        onClick={() => onEdit(migratedRef)}
                        className="btn btn-sm btn-edit"
                        title="編集"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => onDelete(ref.id)}
                        className="btn btn-sm btn-delete"
                        title="削除"
                      >
                        🗑️
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
          {searchTerm ? '検索条件に一致する参考文献がありません' : '参考文献がありません'}
        </div>
      )}
    </div>
  );
};

export default ReferenceTable;
