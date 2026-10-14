import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import useEscapeKey from '../hooks/useEscapeKey';
import { collectReadingGroups } from '../utils/bulkEdit';

// 未登録・読み方が食い違う名前を先に、出てくる文献の多い順に並べる（直す必要があるものから順に目に入るように）
const groupPriority = (group) => (group.isMissing ? 0 : group.hasConflict ? 1 : 2);
const sortGroups = (groups) => [...groups].sort((a, b) =>
  groupPriority(a) - groupPriority(b) || b.referenceIds.length - a.referenceIds.length || a.name.localeCompare(b.name, 'ja')
);

const describeStatus = (group) => {
  if (group.hasConflict) return `読み方が${group.readings.length}通りあります（${group.readings.join('・')}）`;
  if (group.isMissing && group.readings.length > 0) return '一部の文献で未登録';
  if (group.isMissing) return '未登録';
  return '登録済み';
};

// 同じ団体名・著者名の読み仮名を、名前ごとに1回の入力でまとめて登録する
const ReadingBulkModal = ({ references, onSave, onClose }) => {
  useEscapeKey(true, onClose);
  const groups = useMemo(() => sortGroups(collectReadingGroups(references)), [references]);
  // 登録済みの読み方があれば、いちばん多いものを初期値にして、入力の手間を減らす
  const [readingByKey, setReadingByKey] = useState(() => Object.fromEntries(groups.map(group => [group.key, group.readings[0] || ''])));
  const [showRegistered, setShowRegistered] = useState(false);
  const [editedKeys, setEditedKeys] = useState(() => new Set());

  const needsAttention = (group) => group.isMissing || group.hasConflict;
  const visibleGroups = showRegistered ? groups : groups.filter(needsAttention);

  // 未登録の文献があれば、初期値（他の文献で登録済みの読み方）のままでも反映する。
  // 読み方が食い違う名前は、どれが正しいかを本人が選び直したときだけ反映する
  const changedGroups = groups.filter(group => {
    const reading = (readingByKey[group.key] || '').trim();
    if (!reading) return false;
    if (group.hasConflict) return editedKeys.has(group.key);
    return group.isMissing || reading !== group.readings[0];
  });
  const changedReferenceCount = new Set(changedGroups.flatMap(group => group.referenceIds)).size;

  const handleSave = () => {
    const readings = Object.fromEntries(changedGroups.map(group => [group.key, readingByKey[group.key].trim()]));
    onSave(readings, { nameCount: changedGroups.length, referenceCount: changedReferenceCount });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content bulk-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reading-bulk-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="reading-bulk-title">読み仮名をまとめて登録</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="閉じる"><X size={20} /></button>
        </div>

        <div className="modal-body">
          <p className="bulk-lead">
            同じ団体名・著者名の文献に、同じ読み仮名をまとめて登録します。読み仮名は著者名順の並べ替えに使います。
          </p>
          <label className="bulk-toggle">
            <input type="checkbox" checked={showRegistered} onChange={(e) => setShowRegistered(e.target.checked)} />
            登録済みの名前も表示する
          </label>

          {visibleGroups.length === 0 ? (
            <p className="bulk-empty">
              読み仮名が未登録の名前はありません。登録済みの読み仮名を直すときは「登録済みの名前も表示する」をオンにしてください。
            </p>
          ) : (
            <ul className="reading-group-list">
              {visibleGroups.map(group => {
                const inputId = `reading-${group.key}`;
                return (
                  <li key={group.key} className="reading-group">
                    <div className="reading-group-name">
                      <label htmlFor={inputId}>{group.name}</label>
                      <span className="reading-group-meta">
                        {group.kind === 'organization' ? '団体' : '人名'}・{group.referenceIds.length}件の文献・{describeStatus(group)}
                      </span>
                    </div>
                    <input
                      id={inputId}
                      type="text"
                      className="reading-group-input"
                      value={readingByKey[group.key]}
                      onChange={(e) => {
                        setReadingByKey(prev => ({ ...prev, [group.key]: e.target.value }));
                        setEditedKeys(prev => new Set(prev).add(group.key));
                      }}
                      placeholder="よみがな"
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="modal-footer bulk-footer">
          <span className="bulk-summary" aria-live="polite">
            {changedGroups.length > 0
              ? `${changedGroups.length}件の名前・${changedReferenceCount}件の文献を更新します`
              : '読み仮名を入力すると、更新する文献の数がここに出ます'}
          </span>
          <button type="button" className="btn btn-secondary" onClick={onClose}>キャンセル</button>
          <button type="button" className="btn btn-primary" onClick={handleSave} disabled={changedGroups.length === 0}>
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadingBulkModal;
