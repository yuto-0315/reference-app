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
import {
  loadFromStorage, readStoredReferences, saveToStorage, isDuplicate, validateAndCleanData, stripComputedFields,
  planImport, createUndo, removeContentDuplicates, CORRUPT_BACKUP_SUFFIX
} from './utils/dataUtils';
import { BookOpenText, Library, X } from 'lucide-react';

const STORAGE_KEY = 'reference-app-data';
// 一覧のチェック（出力する文献の選択）も、再読み込みで消えないように保存する
const CHECKED_STORAGE_KEY = 'reference-app-checked';

const readCheckedIds = () => {
  try {
    const ids = JSON.parse(localStorage.getItem(CHECKED_STORAGE_KEY) || '[]');
    return new Set(Array.isArray(ids) ? ids.map(String) : []);
  } catch (error) {
    return new Set();
  }
};

// 読めなかった保存データを、ファイルとして手元に残せるようにする
const downloadText = (text, fileName) => {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
const ALERT_DURATION_MS = 3000;
// 更新した行の強調は、移動して目で探し当てるのに十分で、作業の邪魔にならない長さにする
const RECENT_HIGHLIGHT_MS = 2500;

function App() {
  // ローカルストレージから自動読み込み（重複除去付き）
  // 初回描画前に読み込むことで、空配列で保存データを上書きする余地をなくす
  const [initialStorage] = useState(() => readStoredReferences(STORAGE_KEY));
  const [references, setReferences] = useState(initialStorage.references);
  const [selectedReference, setSelectedReference] = useState(null);
  const [alert, setAlert] = useState(null);
  // 同じ文言のコピーが続いても毎回表示し直せるよう、表示ごとに id を振る
  const [toast, setToast] = useState(null);
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const [checkedReferences, setCheckedReferences] = useState(readCheckedIds);
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
  const saveFailedRef = useRef(false);
  // 続けて削除したとき、まとめて元に戻せるよう、最初の削除の前の一覧を覚えておく
  const deleteBatchRef = useRef(null);

  // 自動保存（ローカルストレージ）- 重複除去付き
  // 0件も保存しないと、最後の1件を削除しても再読み込みで復活してしまう
  useEffect(() => {
    const saved = saveToStorage(STORAGE_KEY, references);
    // 保存できないまま作業を続けると、閉じたときに入力がすべて消えるため、すぐに知らせてファイルへの保存を促す
    if (!saved && !saveFailedRef.current) {
      showAlert(
        'ブラウザに保存できませんでした（空き容量が足りない可能性があります）。このまま閉じると変更が消えるため、「JSONエクスポート」でファイルに保存してください',
        'error',
        { label: 'JSONエクスポート', onClick: exportToJSON }
      );
    }
    saveFailedRef.current = !saved;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [references]);

  useEffect(() => {
    try {
      localStorage.setItem(CHECKED_STORAGE_KEY, JSON.stringify([...checkedReferences]));
    } catch (error) {
      // チェックが残らないだけで、文献のデータには影響しない
    }
  }, [checkedReferences]);

  // 保存データが読めなかったときは、空の一覧で黙って上書きせず、退避した元のデータを保存できるようにする
  useEffect(() => {
    const downloadOriginal = {
      label: '元のデータをファイルに保存',
      onClick: () => downloadText(localStorage.getItem(`${STORAGE_KEY}${CORRUPT_BACKUP_SUFFIX}`) || '', 'references_unreadable.json')
    };
    if (initialStorage.problem === 'unreadable') {
      showAlert(
        '保存されていたデータを読み込めませんでした。元のデータは別の場所に残してあるので、ファイルに保存して、最後にエクスポートしたJSONと見比べてください',
        'error',
        downloadOriginal
      );
    } else if (initialStorage.problem === 'unavailable') {
      showAlert('このブラウザの設定で、データを保存できない状態です。閉じると入力が消えるため、作業の終わりに「JSONエクスポート」で保存してください', 'error');
    } else if (initialStorage.invalidCount > 0) {
      showAlert(
        `文献の種類が分からないデータ${initialStorage.invalidCount}件を読み込めませんでした。元のデータは残してあるので、ファイルに保存できます`,
        'warning',
        downloadOriginal
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 別のタブで保存されたら読み込み直す（2つのタブで開いていると、後から保存した側が先の変更を消してしまうため）
  // 読み込んだ内容をそのまま保存し直しても値は変わらないので、タブ同士で保存を繰り返すことはない
  useEffect(() => {
    const handleStorageChange = (event) => {
      // key が null のときは、別のタブで保存データ全体が消された
      if (event.key !== null && event.key !== STORAGE_KEY) return;
      setReferences(loadFromStorage(STORAGE_KEY));
      if (event.key === null) setCheckedReferences(new Set());
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
    const deletedReference = references.find(ref => ref.id === id);
    if (!deletedReference) return;
    // 「元に戻す」を押す前に続けて削除しても、まとめて戻せるようにする
    const batch = deleteBatchRef.current || { before: references, checkedIds: new Set(), count: 0 };
    const nextReferences = references.filter(ref => ref.id !== id);
    if (checkedReferences.has(id)) batch.checkedIds.add(id);
    batch.count += 1;
    const undo = createUndo(batch.before, nextReferences);
    const restoredCheckedIds = new Set(batch.checkedIds);

    setReferences(nextReferences);
    setCheckedReferences(prev => {
      const newSet = new Set(prev);
      newSet.delete(id);
      return newSet;
    });
    if (selectedReference && selectedReference.id === id) {
      setSelectedReference(null);
    }
    const message = batch.count > 1
      ? `${batch.count}件の文献を削除しました（最後に削除したのは「${deletedReference.title || '（タイトルなし）'}」）`
      : `「${deletedReference.title || '（タイトルなし）'}」を削除しました`;
    showAlert(message, 'success', {
      label: batch.count > 1 ? `${batch.count}件とも元に戻す` : '元に戻す',
      onClick: () => {
        setReferences(undo);
        setCheckedReferences(prev => new Set([...prev, ...restoredCheckedIds]));
        showAlert('削除を取り消しました', 'info');
      }
    });
    deleteBatchRef.current = batch;
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
      let importedData;
      try {
        importedData = JSON.parse(e.target.result);
      } catch (error) {
        showAlert('JSONファイルとして読み込めませんでした。このアプリの「JSONエクスポート」で保存したファイルを選んでください', 'error');
        return;
      }
      if (!Array.isArray(importedData)) {
        showAlert('このアプリの文献データではないようです。「JSONエクスポート」で保存したファイルを選んでください', 'error');
        return;
      }

      const plan = planImport(references, importedData, uuidv4);
      // 取り込まなかった件数も、最後のお知らせ1つにまとめて伝える（途中のお知らせはすぐ上書きされて読めないため）
      const notes = [];
      if (plan.updated > 0) notes.push(`${plan.updated}件を新しい内容に更新`);
      if (plan.unchanged > 0) notes.push(`${plan.unchanged}件は登録済みの内容と同じか古いため変更なし`);
      if (plan.duplicates > 0) notes.push(`同じ内容の${plan.duplicates}件をスキップ`);
      if (plan.invalid > 0) notes.push(`文献の種類がないなど読み込めないデータ${plan.invalid}件を除外`);
      const notesText = notes.length > 0 ? `（${notes.join('、')}）` : '';

      if (plan.added === 0 && plan.updated === 0) {
        showAlert(`取り込める新しい文献はありませんでした${notesText}`, 'warning');
        return;
      }
      replaceReferencesWithUndo(plan.next, `${plan.added}件の参考文献を追加しました${notesText}`, '読み込む前に戻しました');
    };
    reader.onerror = () => showAlert('ファイルを読み込めませんでした。もう一度選び直してください', 'error');
    reader.readAsText(file);
    event.target.value = ''; // ファイル選択をリセット
  };

  const showAlert = (message, type, action = null) => {
    // 前のアラートのタイマーが残っていると、新しいアラートが表示途中で消えてしまう
    clearTimeout(alertTimerRef.current);
    // 削除以外のお知らせを出したら、続けて削除したときの「まとめて元に戻す」は区切る
    deleteBatchRef.current = null;
    setAlert({ message, type, action });
    // エラーは読み逃すと次に何をすればよいか分からないため、閉じるまで表示し続ける
    // 「元に戻す」などの操作が付いたお知らせも、押す前に消えないようにする
    if (type === 'error' || action) return;
    alertTimerRef.current = setTimeout(() => setAlert(null), ALERT_DURATION_MS);
  };

  const closeAlert = () => {
    clearTimeout(alertTimerRef.current);
    deleteBatchRef.current = null;
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

  // 同じ文献の二重登録（参考文献一覧に同じ行が2回出るもの）と、読み込めないデータを取り除く
  const cleanupData = () => {
    const { cleaned, stats } = validateAndCleanData(references);
    const withoutContentDuplicates = removeContentDuplicates(cleaned);
    const duplicateCount = stats.duplicatesRemoved + (cleaned.length - withoutContentDuplicates.length);

    if (duplicateCount === 0 && stats.invalidDataRemoved === 0) {
      showAlert('同じ文献の二重登録や、読み込めないデータはありませんでした', 'info');
      return;
    }
    replaceReferencesWithUndo(
      withoutContentDuplicates,
      `同じ文献の二重登録${duplicateCount}件、読み込めないデータ${stats.invalidDataRemoved}件を取り除きました`,
      '取り除く前に戻しました'
    );
  };

  // まとめて書き換えたあとも「元に戻す」で前の状態に戻せるようにする（確認ダイアログの代わりに取り消せる安心感を出す）。
  // 戻すのは今回変えた文献だけにして、そのあと別のタブなどで加えた変更は残す
  const replaceReferencesWithUndo = (nextReferences, message, undoneMessage = 'まとめて変更する前に戻しました') => {
    const undo = createUndo(references, nextReferences);
    setReferences(nextReferences);
    setBulkDialog(null);
    showAlert(message, 'success', {
      label: '元に戻す',
      onClick: () => {
        setReferences(undo);
        showAlert(undoneMessage, 'info');
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

  // 選び直すのに手間のかかるチェックをまとめて変えたときは、元のチェックに戻せるようにする
  const replaceChecksWithUndo = (nextChecked, message) => {
    const previousChecked = checkedReferences;
    setCheckedReferences(nextChecked);
    const hadChecks = references.some(ref => previousChecked.has(ref.id));
    if (!hadChecks) return;
    showAlert(message, 'info', {
      label: '元のチェックに戻す',
      onClick: () => {
        setCheckedReferences(previousChecked);
        showAlert('チェックを元に戻しました', 'info');
      }
    });
  };

  const toggleAllReferences = (checked) => {
    if (checked) {
      setCheckedReferences(new Set(references.map(ref => ref.id)));
    } else {
      replaceChecksWithUndo(new Set(), 'すべてのチェックを外しました');
    }
  };

  const bulkCheckReferences = (ids, label) => {
    replaceChecksWithUndo(new Set(ids), `${label || '選んだ種類'}の文献だけにチェックしました`);
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
          から、読み仮名の候補は<a href="https://id.ndl.go.jp/auth/ndla" target="_blank" rel="noopener noreferrer">国立国会図書館の典拠データ（Web NDL Authorities）</a>
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
