import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import useDialog from '../hooks/useDialog';
import { getBulkEditableFields } from '../utils/bulkEdit';
import { REFERENCE_TYPES } from '../utils/formatters';

// いま入っている値のうち最も多いものを初期値にする（全件同じなら、その値を少し直すだけで済む）
const mostCommonValue = (references, field) => {
  const counts = new Map();
  references
    .filter(ref => field.referenceIds.includes(ref.id))
    .forEach(ref => {
      const value = ref[field.key] === undefined || ref[field.key] === null ? '' : String(ref[field.key]);
      if (value) counts.set(value, (counts.get(value) || 0) + 1);
    });
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || '';
};

const validateValue = (field, value) => {
  if (!value.trim()) return '値を入力してください';
  if (field.inputType === 'number' && !/^\d{4}$/.test(value.trim())) return '西暦4桁の半角数字（例: 2024）で入力してください';
  return '';
};

const currentValueOf = (ref, field) => (ref[field.key] === undefined || ref[field.key] === null ? '' : String(ref[field.key]));

// 文献ごとに値がばらばらな項目は、まとめてそろえたい項目である見込みが高いので、最初に選んでおく
const pickDefaultField = (references, fields) => {
  const varies = (field) => new Set(references.filter(ref => field.referenceIds.includes(ref.id)).map(ref => currentValueOf(ref, field))).size > 1;
  const widestCount = Math.max(0, ...fields.map(field => field.referenceIds.length));
  return fields.find(field => field.referenceIds.length === widestCount && varies(field)) || fields[0];
};

// 一覧でチェックした文献の、同じ項目をまとめて同じ値にする
const BulkEditModal = ({ references, onSave, onClose }) => {
  const dialogRef = useDialog(true, onClose);
  const fields = useMemo(() => getBulkEditableFields(references), [references]);
  const [fieldKey, setFieldKey] = useState(() => pickDefaultField(references, fields)?.key || '');
  const field = fields.find(item => item.key === fieldKey);
  const [value, setValue] = useState(() => (field ? mostCommonValue(references, field) : ''));
  const [hasTriedSave, setHasTriedSave] = useState(false);

  const handleFieldChange = (nextKey) => {
    const nextField = fields.find(item => item.key === nextKey);
    setFieldKey(nextKey);
    setValue(mostCommonValue(references, nextField));
    setHasTriedSave(false);
  };

  const errorMessage = field ? validateValue(field, value) : '';
  // すでに同じ値の文献は変わらないので、実際に変わる件数を数える
  const changingCount = field
    ? references.filter(ref => field.referenceIds.includes(ref.id) && currentValueOf(ref, field) !== value.trim()).length
    : 0;
  const handleSave = () => {
    setHasTriedSave(true);
    if (errorMessage || changingCount === 0) return;
    onSave(field, value.trim(), field.referenceIds);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content bulk-modal"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-edit-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="bulk-edit-title">チェックした{references.length}件をまとめて編集</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="閉じる"><X size={20} /></button>
        </div>

        <div className="modal-body">
          {!field ? (
            <p className="bulk-empty">
              チェックした文献には、まとめて設定できる項目がありません。書名やURLのように文献ごとに違う項目は、各文献の「編集」から直してください。
            </p>
          ) : (
            <>
              <div className="bulk-form">
                <div className="form-group">
                  <label htmlFor="bulk-field">設定する項目</label>
                  <select id="bulk-field" value={fieldKey} onChange={(e) => handleFieldChange(e.target.value)}>
                    {fields.map(item => (
                      <option key={item.key} value={item.key}>
                        {item.label}（{item.referenceIds.length}件）
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="bulk-value">新しい値</label>
                  <input
                    id="bulk-value"
                    type={field.inputType === 'date' ? 'date' : 'text'}
                    inputMode={field.inputType === 'number' ? 'numeric' : undefined}
                    className={hasTriedSave && errorMessage ? 'error' : ''}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    aria-invalid={hasTriedSave && Boolean(errorMessage)}
                    aria-describedby={hasTriedSave && errorMessage ? 'bulk-value-error' : undefined}
                  />
                  {hasTriedSave && errorMessage && <p id="bulk-value-error" className="error-message">{errorMessage}</p>}
                </div>
              </div>

              <h3 className="bulk-preview-title">変更内容</h3>
              <ul className="bulk-preview-list">
                {references.map(ref => {
                  const isTarget = field.referenceIds.includes(ref.id);
                  const currentValue = currentValueOf(ref, field) || '（空欄）';
                  const isUnchanged = isTarget && currentValueOf(ref, field) === value.trim();
                  return (
                    <li key={ref.id} className={`bulk-preview-item${isTarget ? '' : ' is-skipped'}`}>
                      <span className="bulk-preview-ref">{ref.title || '（タイトルなし）'}</span>
                      <span className="bulk-preview-change">
                        {!isTarget && `${REFERENCE_TYPES[ref.type] || ref.type}には「${field.label}」がないため変更しません`}
                        {isUnchanged && `${currentValue}（すでに同じ値なので変わりません）`}
                        {isTarget && !isUnchanged && `${currentValue} → ${value.trim() || '（未入力）'}`}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        <div className="modal-footer bulk-footer">
          {field && !errorMessage && changingCount === 0 && (
            <span className="bulk-summary" aria-live="polite">すべて同じ値のため、変わる文献はありません</span>
          )}
          <button type="button" className="btn btn-secondary" onClick={onClose}>キャンセル</button>
          {field && (
            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={!errorMessage && changingCount === 0}>
              {changingCount}件を変更
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkEditModal;
