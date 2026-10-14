import React, { useCallback, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import ReferenceForm from './ReferenceForm';

// 一覧の「編集」を押した場所の上に開き、何を編集しているかが一目で分かるようにする。
// 閉じれば一覧の同じ位置に戻るので、画面上部の追加フォームとの行き来がいらない
const EditReferenceModal = ({ reference, onSubmit, onClose }) => {
  const isDirtyRef = useRef(false);
  const headingRef = useRef(null);

  const handleDirtyChange = useCallback((isDirty) => { isDirtyRef.current = isDirty; }, []);

  // 書きかけの変更は、確認してから捨てる
  const requestClose = useCallback(() => {
    if (isDirtyRef.current && !window.confirm('変更した内容が保存されていません。破棄して閉じますか？')) return;
    onClose();
  }, [onClose]);

  useEffect(() => {
    // 読み上げでも編集画面が開いたことが分かるよう、見出しにフォーカスを移す
    headingRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      // 検索結果や入力ガイドなど、編集画面の上に開いた画面の Esc では編集画面まで閉じない
      if (document.querySelectorAll('[aria-modal="true"]').length > 1) return;
      requestClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [requestClose]);

  return (
    <div className="modal-overlay" onClick={requestClose}>
      <div
        className="modal-content edit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="edit-modal-heading">
            <h2 id="edit-modal-title" ref={headingRef} tabIndex={-1}>参考文献を編集</h2>
            <p className="edit-modal-target">{reference.title || '（タイトルなし）'}</p>
          </div>
          <button type="button" className="modal-close" onClick={requestClose} aria-label="閉じる"><X size={20} /></button>
        </div>
        <div className="modal-body">
          <ReferenceForm
            onSubmit={onSubmit}
            initialData={reference}
            isEditing
            idPrefix="edit-"
            onCancel={requestClose}
            onDirtyChange={handleDirtyChange}
          />
        </div>
      </div>
    </div>
  );
};

export default EditReferenceModal;
