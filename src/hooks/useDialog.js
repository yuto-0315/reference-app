import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])', 'textarea:not([disabled])', 'summary', '[tabindex]:not([tabindex="-1"])'
].join(',');

// いちばん手前に開いているダイアログだけが Esc や Tab に反応するようにする
// （確認画面の上に別の画面を重ねたとき、Esc で両方が閉じないように）
const isTopmostDialog = (dialog) => {
  const openDialogs = document.querySelectorAll('[aria-modal="true"]');
  return openDialogs[openDialogs.length - 1] === dialog;
};

/**
 * モーダルのダイアログを、キーボードや読み上げでも迷わず使えるようにする。
 * - 開いたらダイアログへフォーカスを移す（data-autofocus の要素があればそこへ）
 * - Tab で背後の画面へ抜け出さない
 * - Esc で閉じる
 * - 閉じたら、開く前にいた場所へフォーカスを戻す
 * 返り値の ref を role="dialog" の要素に付ける
 */
const useDialog = (isOpen, onClose) => {
  const dialogRef = useRef(null);
  // 親の再描画のたびに onClose が作り直されても、フォーカスを移し直さないよう ref で持つ
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;
    const dialog = dialogRef.current;
    if (!dialog) return undefined;
    const previouslyFocused = document.activeElement;

    if (!dialog.hasAttribute('tabindex')) dialog.setAttribute('tabindex', '-1');
    const initialTarget = dialog.querySelector('[data-autofocus]') || dialog;
    initialTarget.focus({ preventScroll: initialTarget === dialog });

    const handleKeyDown = (event) => {
      if (!isTopmostDialog(dialog)) return;
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }
      if (event.key !== 'Tab') return;
      const focusable = [...dialog.querySelectorAll(FOCUSABLE_SELECTOR)].filter(element => element.offsetParent !== null);
      if (focusable.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const isOutside = !dialog.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog || isOutside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || isOutside)) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // 開く前の要素が残っていれば、そこへ戻す（削除などで消えていたら、ブラウザの既定に任せる）
      if (previouslyFocused && previouslyFocused.isConnected && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [isOpen]);

  return dialogRef;
};

export default useDialog;
