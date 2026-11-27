import React, { useCallback, useRef } from 'react';
import useDialog from '../hooks/useDialog';
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

  // 読み上げでも編集画面が開いたことが分かるよう見出しにフォーカスを移し、閉じたら「編集」ボタンへ戻す。
  // 検索結果や入力ガイドなど、編集画面の上に開いた画面の Esc では編集画面まで閉じない
  const dialogRef = useDialog(true, requestClose);

  return (
    <div className="modal-overlay" onClick={requestClose}>
      <div
        ref={dialogRef}
        className="modal-content edit-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="edit-modal-heading">
            <h2 id="edit-modal-title" ref={headingRef} tabIndex={-1} data-autofocus>参考文献を編集</h2>
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
