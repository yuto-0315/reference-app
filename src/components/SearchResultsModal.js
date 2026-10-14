import React from 'react';
import useEscapeKey from '../hooks/useEscapeKey';

const SearchResultsModal = ({ isOpen, onClose, results, onSelect }) => {
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="search-results-title" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="search-results-title">論文検索結果</h2>
        </div>
        <div className="modal-body">
          {results.length > 0 ? (
            <ul className="search-results-list">
              {results.map((item, index) => (
                <li key={index}>
                  {/* キーボードでも選べるよう、行全体を button にする */}
                  <button type="button" className="search-result-item" onClick={() => onSelect(item)}>
                    <strong>{item.title}</strong>
                    <p className="search-result-meta">{item.authors?.join(', ')}</p>
                    <p className="search-result-meta"><em>{item.journal}</em>{item.year ? `, ${item.year}` : ''}</p>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>検索結果が見つかりませんでした。別のキーワード（論文名の一部など）で検索してみてください。</p>
          )}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsModal;
