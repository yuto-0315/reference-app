import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReferenceForm from './components/ReferenceForm';
import ReferenceTable from './components/ReferenceTable';
import PreviewSection from './components/PreviewSection';
import FileControls from './components/FileControls';
import ThemeToggle from './components/ThemeToggle';
import ReadingBulkModal from './components/ReadingBulkModal';
import EditReferenceModal from './components/EditReferenceModal';
import BulkEditModal from './components/BulkEditModal';
import { applyReadings, applyFieldValue } from './utils/bulkEdit';
import { PALETTE_SOURCE } from './utils/themes';
import { readLastBackup, saveLastBackup, fingerprintReferences } from './utils/backupStatus';
import FormatGuideModal from './components/FormatGuideModal';
import Toast from './components/Toast';
import VersionInfo from './components/VersionInfo';
import { loadFromStorage, saveToStorage, isDuplicate, validateAndCleanData, stripComputedFields } from './utils/dataUtils';
import { BookOpenText, Library, X } from 'lucide-react';

const STORAGE_KEY = 'reference-app-data';
const ALERT_DURATION_MS = 3000;
// 更新した行の強調は、移動して目で探し当てるのに十分で、作業の邪魔にならない長さにする
const RECENT_HIGHLIGHT_MS = 2500;

function App() {
  // ローカルストレージから自動読み込み（重複除去付き）
  // 初回描画前に読み込むことで、空配列で保存データを上書きする余地をなくす
  const [references, setReferences] = useState(() => loadFromStorage(STORAGE_KEY));
  const [selectedReference, setSelectedReference] = useState(null);
  const [alert, setAlert] = useState(null);
  // 同じ文言のコピーが続いても毎回表示し直せるよう、表示ごとに id を振る
  const [toast, setToast] = useState(null);
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const [checkedReferences, setCheckedReferences] = useState(new Set());
  // 'reading'（読み仮名をまとめて登録）か 'fields'（チェックした文献をまとめて編集）
  const [bulkDialog, setBulkDialog] = useState(null);
  const alertTimerRef = useRef(null);
  const formSectionRef = useRef(null);
  const isFormDirtyRef = useRef(false);
  // 一覧の「複製」で追加フォームに読み込む文献
  const [duplicateSource, setDuplicateSource] = useState(null);
  const [lastBackup, setLastBackup] = useState(readLastBackup);
  // エクスポートと同じ整え方をした内容で比べ、前回のバックアップから変わったかを判定する
  const currentFingerprint = useMemo(() => fingerprintReferences(validateAndCleanData(references).cleaned), [references]);
  // 更新した直後の行を少しの間だけ目立たせ、一覧のどこが変わったかを分かるようにする
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState(null);

  // 自動保存（ローカルストレージ）- 重複除去付き
  // 0件も保存しないと、最後の1件を削除しても再読み込みで復活してしまう
  useEffect(() => {
    saveToStorage(STORAGE_KEY, references);
  }, [references]);

  // 別のタブで保存されたら読み込み直す（2つのタブで開いていると、後から保存した側が先の変更を消してしまうため）
  // 読み込んだ内容をそのまま保存し直しても値は変わらないので、タブ同士で保存を繰り返すことはない
  useEffect(() => {
    const handleStorageChange = (event) => {
      // key が null のときは、別のタブで保存データ全体が消された
      if (event.key !== null && event.key !== STORAGE_KEY) return;
      setReferences(loadFromStorage(STORAGE_KEY));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addReference = (referenceData) => {
    // 「複製」で読み込んだ文献から追加する場合もあるため、
    // 元の文献のIDや作成日時は引き継がず、必ず新しい値を振る
    const newReference = {
      ...stripComputedFields(referenceData),
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 重複チェック（内容ベース）
    if (isDuplicate(references, newReference)) {
      showAlert('同じ内容の参考文献が既に存在します', 'error');
      // 追加できなかったことをフォームに伝え、入力内容を残してもらう
      return false;
    }

    setReferences(prev => [...prev, newReference]);
    showAlert('参考文献を追加しました', 'success');
    return true;
  };

  const updateReference = (id, referenceData) => {
    setReferences(prev => {
      // 統合ではなく置き換える。編集中に種類を変えたとき、前の種類の項目（著者・ページなど）が
      // 画面からは消えたのにデータに残り、引用に混ざってしまうため（フォームには元の文献の全項目が入っている）
      const updated = prev.map(ref =>
        ref.id === id
          ? { ...stripComputedFields(referenceData), id, createdAt: ref.createdAt, updatedAt: new Date().toISOString() }
          : ref
      );

      // 更新後に重複チェックと除去
      const { cleaned } = validateAndCleanData(updated);
      return cleaned;
    });

    setSelectedReference(null);
    showAlert('参考文献を更新しました', 'success');
    returnToRow(id);
  };

  // 似た文献（同じ本の別の巻など）を、元の文献の内容から作り始められるようにする
  const duplicateReference = (reference) => {
    if (isFormDirtyRef.current
      && !window.confirm('追加フォームに入力中の内容があります。複製する文献の内容に置き換えますか？')) {
      return;
    }
    const { id, createdAt, updatedAt, ...copiedFields } = stripComputedFields(reference);
    setDuplicateSource(copiedFields);
    showAlert(`「${reference.title || '（タイトルなし）'}」の内容を追加フォームに入れました。違うところを直して「追加」してください`, 'info');
    // 追加フォームは一覧から離れた画面上部にあるため、入った内容が見えるところまで移動する
    requestAnimationFrame(() => {
      const section = formSectionRef.current;
      if (!section) return;
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      section.querySelector('.section-title')?.focus({ preventScroll: true });
    });
  };

  // 更新した行を少しの間だけ枠で示す。編集画面は行の上で開いていたので、閉じれば同じ位置に戻っている
  const returnToRow = (id) => {
    setRecentlyUpdatedId(id);
    setTimeout(() => setRecentlyUpdatedId(current => (current === id ? null : current)), RECENT_HIGHLIGHT_MS);
    requestAnimationFrame(() => {
      document.getElementById(`reference-row-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  // 確認ダイアログを挟まずに削除し、間違えたときは「元に戻す」で同じ位置に戻せるようにする
  const deleteReference = (id) => {
    const deletedIndex = references.findIndex(ref => ref.id === id);
    if (deletedIndex === -1) return;
    const deletedReference = references[deletedIndex];
    const wasChecked = checkedReferences.has(id);

    setReferences(prev => prev.filter(ref => ref.id !== id));
    setCheckedReferences(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    if (selectedReference && selectedReference.id === id) {
      setSelectedReference(null);
    }
    showAlert(`「${deletedReference.title || '（タイトルなし）'}」を削除しました`, 'success', {
      label: '元に戻す',
      onClick: () => {
        setReferences(prev => {
          if (prev.some(ref => ref.id === id)) return prev;
          const restored = [...prev];
          restored.splice(Math.min(deletedIndex, restored.length), 0, deletedReference);
          return restored;
        });
        if (wasChecked) setCheckedReferences(prev => new Set(prev).add(id));
        showAlert('削除を取り消しました', 'info');
      }
    });
  };

  const exportToJSON = () => {
    // エクスポート前にデータをクリーンアップ
    const { cleaned } = validateAndCleanData(references);
    const dataStr = JSON.stringify(cleaned, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    // toISOString() は UTC のため、日本の午前0〜9時に保存すると前日の日付になる。端末の日付で名前を付ける
    const today = new Date();
    const localDate = [today.getFullYear(), today.getMonth() + 1, today.getDate()]
      .map(part => String(part).padStart(2, '0'))
      .join('-');
    link.download = `references_${localDate}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setLastBackup(saveLastBackup(cleaned));
    showAlert('JSONファイルをダウンロードしました', 'success');
  };

  const importFromJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        if (Array.isArray(importedData)) {
          // ID のない手作りの JSON でも取り込めるよう、先に ID を振ってからクリーンアップする
          // （取り込む文献には、どのみち下で新しい ID を振り直す）
          const importedWithIds = importedData.map(ref =>
            ref && typeof ref === 'object' && !ref.id ? { ...ref, id: uuidv4() } : ref
          );
          const { cleaned: cleanImportedData, stats } = validateAndCleanData(importedWithIds);

          // 既存データとの重複をチェックして除外
          const newReferences = [];
          let duplicateCount = 0;

          cleanImportedData.forEach(ref => {
            // 同じファイル内に同じ内容の文献が複数ある場合も1件にする
            if (!isDuplicate([...references, ...newReferences], ref)) {
              // 新しいIDを生成（既存IDとの衝突を避けるため）
              newReferences.push({
                ...ref,
                id: uuidv4(),
                importedAt: new Date().toISOString()
              });
            } else {
              duplicateCount++;
            }
          });

          // 取り込まなかった件数は、最後のお知らせ1つにまとめて伝える（途中のお知らせはすぐ上書きされて読めないため）
          const skippedNotes = [];
          const totalDuplicates = duplicateCount + stats.duplicatesRemoved;
          if (totalDuplicates > 0) skippedNotes.push(`重複${totalDuplicates}件をスキップ`);
          if (stats.invalidDataRemoved > 0) skippedNotes.push(`文献の種類がないなど読み込めないデータ${stats.invalidDataRemoved}件を除外`);
          const skippedText = skippedNotes.length > 0 ? `（${skippedNotes.join('、')}）` : '';

          if (newReferences.length > 0) {
            setReferences(prev => {
              const combined = [...prev, ...newReferences];
              const { cleaned } = validateAndCleanData(combined);
              return cleaned;
            });
            showAlert(`${newReferences.length}件の参考文献をインポートしました${skippedText}`, 'success');
          } else {
            showAlert(`インポート可能な新しい参考文献がありませんでした${skippedText}`, 'warning');
          }
        } else {
          showAlert('無効なJSONファイルです', 'error');
        }
      } catch (error) {
        showAlert('JSONファイルの読み込みに失敗しました', 'error');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
    event.target.value = ''; // ファイル選択をリセット
  };

  const showAlert = (message, type, action = null) => {
    // 前のアラートのタイマーが残っていると、新しいアラートが表示途中で消えてしまう
    clearTimeout(alertTimerRef.current);
    setAlert({ message, type, action });
    // エラーは読み逃すと次に何をすればよいか分からないため、閉じるまで表示し続ける
    // 「元に戻す」などの操作が付いたお知らせも、押す前に消えないようにする
    if (type === 'error' || action) return;
    alertTimerRef.current = setTimeout(() => setAlert(null), ALERT_DURATION_MS);
  };

  const closeAlert = () => {
    clearTimeout(alertTimerRef.current);
    setAlert(null);
  };

  const handleDirtyChange = useCallback((isDirty) => { isFormDirtyRef.current = isDirty; }, []);

  // Toast側のタイマーがAppの再描画のたびにリセットされないよう、関数の同一性を保つ
  const closeToast = useCallback(() => setToast(null), []);

  const copyToClipboard = (text, feedbackMessage) => {
    navigator.clipboard.writeText(text).then(() => {
      setToast({ message: feedbackMessage, id: Date.now() });
    }).catch(() => {
      showAlert('コピーに失敗しました', 'error');
    });
  };

  const cleanupData = () => {
    const { cleaned, stats } = validateAndCleanData(references);

    if (stats.duplicatesRemoved > 0 || stats.invalidDataRemoved > 0) {
      setReferences(cleaned);
      showAlert(
        `データをクリーンアップしました: 重複${stats.duplicatesRemoved}件、無効データ${stats.invalidDataRemoved}件を除去`,
        'success'
      );
    } else {
      showAlert('クリーンアップが必要なデータはありませんでした', 'info');
    }
  };

  // まとめて書き換えたあとも「元に戻す」で前の状態に戻せるようにする（確認ダイアログの代わりに取り消せる安心感を出す）
  const replaceReferencesWithUndo = (nextReferences, message) => {
    const previousReferences = references;
    setReferences(nextReferences);
    setBulkDialog(null);
    showAlert(message, 'success', {
      label: '元に戻す',
      onClick: () => {
        setReferences(previousReferences);
        showAlert('まとめて変更する前に戻しました', 'info');
      }
    });
  };

  const saveBulkReadings = (readingByKey, { nameCount, referenceCount }) => {
    replaceReferencesWithUndo(
      applyReadings(references, readingByKey, new Date().toISOString()),
      `${nameCount}件の名前の読み仮名を、${referenceCount}件の文献に登録しました`
    );
  };

  const saveBulkField = (field, value, referenceIds) => {
    replaceReferencesWithUndo(
      applyFieldValue(references, referenceIds, field, value, new Date().toISOString()),
      `${referenceIds.length}件の文献の「${field.label}」を「${value}」にしました`
    );
  };

  // チェック状態の管理
  const toggleReferenceCheck = (referenceId) => {
    setCheckedReferences(prev => {
      const newSet = new Set(prev);
      if (newSet.has(referenceId)) {
        newSet.delete(referenceId);
      } else {
        newSet.add(referenceId);
      }
      return newSet;
    });
  };

  const toggleAllReferences = (checked) => {
    if (checked) {
      setCheckedReferences(new Set(references.map(ref => ref.id)));
    } else {
      setCheckedReferences(new Set());
    }
  };

  const bulkCheckReferences = (ids) => {
    setCheckedReferences(new Set(ids));
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-main">
            <h1><Library size={36} className="title-icon" />参考文献管理アプリ</h1>
            <p>音楽領域-卒業論文の参考文献と引用を正しい形式で管理・生成</p>
            <VersionInfo />
          </div>
          <div className="header-controls">
            <button
              className="btn btn-secondary"
              onClick={() => setShowFormatGuide(true)}
              title="参考文献の書き方を見る"
            >
              <BookOpenText size={16} />書き方ガイド
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {alert && (
        <div
          className={`alert alert-${alert.type}`}
          role={alert.type === 'error' ? 'alert' : 'status'}
        >
          <span className="alert-message">{alert.message}</span>
          {alert.action && (
            <button type="button" className="btn btn-secondary btn-small" onClick={alert.action.onClick}>
              {alert.action.label}
            </button>
          )}
          <button type="button" className="alert-close" onClick={closeAlert} aria-label="通知を閉じる"><X size={18} /></button>
        </div>
      )}

      <FileControls
        onExport={exportToJSON}
        onImport={importFromJSON}
        referenceCount={references.length}
        onCleanup={cleanupData}
        lastBackup={lastBackup}
        hasChangesSinceBackup={!lastBackup || lastBackup.fingerprint !== currentFingerprint}
      />

      <div className="main-content">
        <div className="input-section" ref={formSectionRef}>
          <h2 className="section-title" tabIndex={-1}>新しい参考文献を追加</h2>
          <ReferenceForm
            onSubmit={addReference}
            initialData={duplicateSource}
            onDirtyChange={handleDirtyChange}
          />
        </div>

        <div className="preview-section">
          <PreviewSection
            references={references}
            checkedReferences={checkedReferences}
            onCopy={copyToClipboard}
            onToggleAll={toggleAllReferences}
            onBulkCheck={bulkCheckReferences}
          />
        </div>
      </div>

      <ReferenceTable
        references={references}
        onEdit={setSelectedReference}
        onDuplicate={duplicateReference}
        recentlyUpdatedId={recentlyUpdatedId}
        onDelete={deleteReference}
        onCopy={copyToClipboard}
        onToggleCheck={toggleReferenceCheck}
        checkedReferences={checkedReferences}
        onOpenReadingBulk={() => setBulkDialog('reading')}
        onOpenBulkEdit={() => setBulkDialog('fields')}
      />

      {selectedReference && (
        <EditReferenceModal
          reference={selectedReference}
          onSubmit={(data) => updateReference(selectedReference.id, data)}
          onClose={() => setSelectedReference(null)}
        />
      )}
      {bulkDialog === 'reading' && (
        <ReadingBulkModal references={references} onSave={saveBulkReadings} onClose={() => setBulkDialog(null)} />
      )}
      {bulkDialog === 'fields' && (
        <BulkEditModal
          references={references.filter(ref => checkedReferences.has(ref.id))}
          onSave={saveBulkField}
          onClose={() => setBulkDialog(null)}
        />
      )}

      {/* 出典は毎回読む情報ではないため、ヘッダーではなくページの下にまとめる */}
      <footer className="app-footer">
        <p>
          一部メタデータは<a href="https://ndlsearch.ndl.go.jp/" target="_blank" rel="noopener noreferrer">国立国会図書館サーチ</a>
          および<a href="https://cir.nii.ac.jp/" target="_blank" rel="noopener noreferrer">CiNii Research</a>
          から取得しています。該当データは各提供機関の利用条件（CC BY 4.0 等）に従っています。
        </p>
        <p>
          配色テーマの一部は<a href={PALETTE_SOURCE.url} target="_blank" rel="noopener noreferrer">{PALETTE_SOURCE.name}</a>をもとにしています。
        </p>
      </footer>

      <FormatGuideModal
        isOpen={showFormatGuide}
        onClose={() => setShowFormatGuide(false)}
      />

      {/* key が変わると作り直されるので、前のトーストのフェードアウト用タイマーも残らない */}
      <Toast
        key={toast?.id}
        message={toast?.message || ''}
        isVisible={!!toast}
        onClose={closeToast}
      />
    </div>
  );
}

export default App;
