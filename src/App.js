import React, { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReferenceForm from './components/ReferenceForm';
import ReferenceTable from './components/ReferenceTable';
import PreviewSection from './components/PreviewSection';
import FileControls from './components/FileControls';
import ThemeToggle from './components/ThemeToggle';
import FormatGuideModal from './components/FormatGuideModal';
import Toast from './components/Toast';
import VersionInfo from './components/VersionInfo';
import { loadFromStorage, saveToStorage, isDuplicate, validateAndCleanData, stripComputedFields } from './utils/dataUtils';

const STORAGE_KEY = 'reference-app-data';
const ALERT_DURATION_MS = 3000;

function App() {
  // ローカルストレージから自動読み込み（重複除去付き）
  // 初回描画前に読み込むことで、空配列で保存データを上書きする余地をなくす
  const [references, setReferences] = useState(() => loadFromStorage(STORAGE_KEY));
  const [selectedReference, setSelectedReference] = useState(null);
  const [alert, setAlert] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showFormatGuide, setShowFormatGuide] = useState(false);
  const [checkedReferences, setCheckedReferences] = useState(new Set());
  const alertTimerRef = useRef(null);

  // 自動保存（ローカルストレージ）- 重複除去付き
  // 0件も保存しないと、最後の1件を削除しても再読み込みで復活してしまう
  useEffect(() => {
    saveToStorage(STORAGE_KEY, references);
  }, [references]);

  const addReference = (referenceData) => {
    // 編集をキャンセルしたフォームから複製として追加する場合もあるため、
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
      const updated = prev.map(ref =>
        ref.id === id
          ? { ...ref, ...referenceData, updatedAt: new Date().toISOString() }
          : ref
      );

      // 更新後に重複チェックと除去
      const { cleaned } = validateAndCleanData(updated);
      return cleaned;
    });

    setSelectedReference(null);
    showAlert('参考文献を更新しました', 'success');
  };

  const deleteReference = (id) => {
    if (window.confirm('この参考文献を削除しますか？')) {
      setReferences(prev => prev.filter(ref => ref.id !== id));
      setCheckedReferences(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      if (selectedReference && selectedReference.id === id) {
        setSelectedReference(null);
      }
      showAlert('参考文献を削除しました', 'success');
    }
  };

  const exportToJSON = () => {
    // エクスポート前にデータをクリーンアップ
    const { cleaned } = validateAndCleanData(references);
    const dataStr = JSON.stringify(cleaned, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `references_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
          // インポートデータをクリーンアップ
          const { cleaned: cleanImportedData, stats } = validateAndCleanData(importedData);

          if (stats.duplicatesRemoved > 0 || stats.invalidDataRemoved > 0) {
            showAlert(
              `インポートデータをクリーンアップしました: 重複${stats.duplicatesRemoved}件、無効データ${stats.invalidDataRemoved}件を除去`,
              'success'
            );
          }

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

          if (newReferences.length > 0) {
            setReferences(prev => {
              const combined = [...prev, ...newReferences];
              const { cleaned } = validateAndCleanData(combined);
              return cleaned;
            });

            const message = duplicateCount > 0
              ? `${newReferences.length}件の参考文献をインポートしました（重複${duplicateCount}件をスキップ）`
              : `${newReferences.length}件の参考文献をインポートしました`;
            showAlert(message, 'success');
          } else {
            showAlert('インポート可能な新しい参考文献がありませんでした', 'warning');
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

  const showAlert = (message, type) => {
    // 前のアラートのタイマーが残っていると、新しいアラートが表示途中で消えてしまう
    clearTimeout(alertTimerRef.current);
    setAlert({ message, type });
    alertTimerRef.current = setTimeout(() => setAlert(null), ALERT_DURATION_MS);
  };

  // Toast側のタイマーがAppの再描画のたびにリセットされないよう、関数の同一性を保つ
  const closeToast = useCallback(() => setToastMessage(''), []);

  const copyToClipboard = (text, feedbackMessage) => {
    navigator.clipboard.writeText(text).then(() => {
      setToastMessage(feedbackMessage);
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
            <h1>📚 参考文献管理アプリ</h1>
            <p>音楽領域-卒業論文の参考文献と引用を正しい形式で管理・生成</p>
            <VersionInfo />
          </div>
          <div className="header-controls">
            <button
              className="btn btn-guide"
              onClick={() => setShowFormatGuide(true)}
              title="参考文献の書き方を見る"
            >
              📖 書き方ガイド
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
          {alert.message}
        </div>
      )}

      <FileControls
        onExport={exportToJSON}
        onImport={importFromJSON}
        referenceCount={references.length}
        onCleanup={cleanupData}
      />

      <div className="main-content">
        <div className="input-section">
          <h2 className="section-title">
            {selectedReference ? '参考文献を編集' : '新しい参考文献を追加'}
          </h2>
          <ReferenceForm
            onSubmit={selectedReference ?
              (data) => updateReference(selectedReference.id, data) :
              addReference
            }
            initialData={selectedReference}
            onCancel={() => setSelectedReference(null)}
          />
        </div>

        <div className="preview-section">
          <PreviewSection
            references={references}
            checkedReferences={checkedReferences}
            onCopy={copyToClipboard}
            onToggleCheck={toggleReferenceCheck}
            onToggleAll={toggleAllReferences}
            onBulkCheck={bulkCheckReferences}
          />
        </div>
      </div>

      <ReferenceTable
        references={references}
        onEdit={setSelectedReference}
        onDelete={deleteReference}
        onCopy={copyToClipboard}
        onToggleCheck={toggleReferenceCheck}
        checkedReferences={checkedReferences}
      />

      <FormatGuideModal
        isOpen={showFormatGuide}
        onClose={() => setShowFormatGuide(false)}
      />

      <Toast
        message={toastMessage}
        isVisible={!!toastMessage}
        onClose={closeToast}
      />
    </div>
  );
}

export default App;
