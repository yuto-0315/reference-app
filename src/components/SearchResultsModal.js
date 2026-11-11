import React from 'react';
import { Loader2, X } from 'lucide-react';
import useEscapeKey from '../hooks/useEscapeKey';

const SearchResultsModal = ({ isOpen, onClose, results, onSelect, selectingResult }) => {
  useEscapeKey(isOpen, onClose);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="search-results-title" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="search-results-title">論文の検索結果{results.length > 0 ? `（${results.length}件）` : ''}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="閉じる"><X size={20} /></button>
        </div>
        <div className="modal-body">
          {results.length > 0 ? (
            <>
              <p className="mapping-lead">追加する論文を選ぶと、著者などの詳しい情報を取得して確認画面を開きます。</p>
              <ul className="search-results-list" aria-busy={Boolean(selectingResult)}>
                {results.map((item, index) => {
                  const isSelecting = selectingResult === item;
                  return (
                    <li key={index}>
                      {/* キーボードでも選べるよう、行全体を button にする。取得中は二重に選べないようにする */}
                      <button
                        type="button"
                        className="search-result-item"
                        onClick={() => onSelect(item)}
                        disabled={Boolean(selectingResult)}
                      >
                        <strong>{item.title}</strong>
                        <p className="search-result-meta">{item.authors?.join(', ')}</p>
                        <p className="search-result-meta"><em>{item.journal}</em>{item.year ? `, ${item.year}` : ''}</p>
                        {isSelecting && (
                          <p className="search-result-loading" role="status">
                            <Loader2 size={16} className="spin" />詳しい情報を取得しています…
                          </p>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
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
