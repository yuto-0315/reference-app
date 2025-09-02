import React from 'react';

const SearchResultsModal = ({ isOpen, onClose, results, onSelect }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>論文検索結果</h2>
        </div>
        <div className="modal-body">
          {results.length > 0 ? (
            <ul>
              {results.map((item, index) => (
                <li key={index} className="search-result-item" onClick={() => onSelect(item)}>
                  <strong>{item.title}</strong>
                  <p>{item.authors?.join(', ')}</p>
                  <p><em>{item.journal}</em>, {item.year}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>検索結果が見つかりませんでした。</p>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>閉じる</button>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsModal;
