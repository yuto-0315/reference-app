import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Copy } from 'lucide-react';
import { formatCitation } from '../utils/formatters';

// 「引用」ボタンのすぐ下に開き、ページを入れながら完成形を確かめてからコピーする
// （ブラウザ標準の入力ダイアログでは、出来上がる引用の形が見えないため）
// 一覧の表は横スクロールの枠の中にあり、枠内に置くと最後の行で切れてしまうため、画面を基準に「引用」ボタンの近くへ置く
const POPOVER_GAP_PX = 4;
const placeNearTrigger = (trigger, popover) => {
  const triggerRect = trigger.getBoundingClientRect();
  const fitsBelow = triggerRect.bottom + POPOVER_GAP_PX + popover.offsetHeight <= window.innerHeight;
  return {
    top: fitsBelow ? triggerRect.bottom + POPOVER_GAP_PX : Math.max(POPOVER_GAP_PX, triggerRect.top - POPOVER_GAP_PX - popover.offsetHeight),
    left: Math.max(POPOVER_GAP_PX, Math.min(triggerRect.left, window.innerWidth - popover.offsetWidth - POPOVER_GAP_PX))
  };
};

const CitationPopover = ({ reference, onCopy, onClose }) => {
  const [page, setPage] = useState('');
  const [position, setPosition] = useState(null);
  const popoverRef = useRef(null);
  const inputRef = useRef(null);
  const citation = formatCitation(reference, page.trim() || reference.pages || '');

  useLayoutEffect(() => {
    const trigger = document.querySelector(`[data-citation-trigger="${reference.id}"]`);
    if (trigger && popoverRef.current) setPosition(placeNearTrigger(trigger, popoverRef.current));
  }, [reference.id]);

  // 位置が決まるまでは見えない状態で、見えない欄にはフォーカスできないため、置き場所が決まってから移す
  useEffect(() => {
    if (position) inputRef.current?.focus({ preventScroll: true });
  }, [position]);

  useEffect(() => {
    // 画面をスクロールするとボタンから離れてしまうため、そのときは閉じる
    const handleScroll = () => onClose({ restoreFocus: false });
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);
    // 外側を押したら閉じる（閉じても何も失われないので確認はしない）
    const handlePointerDown = (event) => {
      if (popoverRef.current?.contains(event.target)) return;
      // 開いたボタン自体を押したときは、ボタン側の切り替えに任せる（ここで閉じると、すぐ開き直してしまう）
      if (event.target.closest?.(`[data-citation-trigger="${reference.id}"]`)) return;
      onClose({ restoreFocus: false });
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [onClose, reference.id]);

  const copyAndClose = () => {
    onCopy(citation, `引用をコピーしました\n${citation}`);
    onClose({ restoreFocus: true });
  };

  const handleKeyDown = (event) => {
    if (event.key !== 'Escape') return;
    event.stopPropagation();
    onClose({ restoreFocus: true });
  };

  // ページを入れて Enter でそのままコピーできるようにする
  const handleInputKeyDown = (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    copyAndClose();
  };

  return (
    <div
      ref={popoverRef}
      className="citation-popover"
      style={position ? { top: position.top, left: position.left } : { visibility: 'hidden' }}
      role="dialog"
      aria-label="引用をコピー"
      onKeyDown={handleKeyDown}
    >
      <label htmlFor={`citation-page-${reference.id}`} className="citation-popover-label">引用するページ</label>
      <input
        ref={inputRef}
        id={`citation-page-${reference.id}`}
        type="text"
        className="citation-popover-input"
        value={page}
        onChange={(e) => setPage(e.target.value)}
        onKeyDown={handleInputKeyDown}
        placeholder={reference.pages ? `空欄なら ${reference.pages}` : '例: 45、45-58'}
      />
      <output className="citation-popover-preview" aria-live="polite">{citation}</output>
      <div className="citation-popover-actions">
        <button type="button" className="btn btn-small btn-secondary" onClick={() => onClose({ restoreFocus: true })}>閉じる</button>
        <button type="button" className="btn btn-small btn-accent" onClick={copyAndClose}>
          <Copy size={14} />コピー
        </button>
      </div>
    </div>
  );
};

export default CitationPopover;
