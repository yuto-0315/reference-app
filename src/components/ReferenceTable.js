import React, { useState, useMemo } from 'react';
import { formatCitation, formatReference, migrateReferenceData } from '../utils/formatters';

const ReferenceTable = ({ references, onEdit, onDelete, onCopy, onToggleCheck, checkedReferences }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('year'); // 'year', 'reading', 'title'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

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
      
      return (
        authorMatches ||
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
          // 筆頭著者の読み仮名または姓で比較
          const aReading = migratedA.authors?.[0]?.reading || migratedA.authors?.[0]?.lastName || '';
          const bReading = migratedB.authors?.[0]?.reading || migratedB.authors?.[0]?.lastName || '';
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
      setSortOrder('desc');
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const copyFormatted = (ref, type) => {
    const text = type === 'citation' 
      ? formatCitation(ref) 
      : formatReference(ref);
    onCopy(text, `${type === 'citation' ? '引用' : '参考文献'}をコピーしました`);
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
            {filteredAndSortedReferences.map((ref) => {
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
                      {migratedRef.authors?.map((author, index) => (
                        <div key={index} className="author-entry">
                          {author.lastName} {author.firstName}
                          {author.reading && (
                            <div className="author-reading">({author.reading})</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="title-cell">
                    <div className="title-text">{ref.title}</div>
                  </td>
                  <td className="year-cell">
                    {ref.year}
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
            })}
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
