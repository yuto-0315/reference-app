import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReferenceForm from './components/ReferenceForm';
import ReferenceTable from './components/ReferenceTable';
import PreviewSection from './components/PreviewSection';
import FileControls from './components/FileControls';
import ThemeToggle from './components/ThemeToggle';
import FormatGuideModal from './components/FormatGuideModal';
import Toast from './components/Toast';
import { formatCitation, formatReference, getReferenceTypeFields } from './utils/formatters';
import { loadFromStorage, saveToStorage, isDuplicate, validateAndCleanData } from './utils/dataUtils';

const STORAGE_KEY = 'reference-app-data';

function App() {
  const [references, setReferences] = useState([]);
  const [selectedReference, setSelectedReference] = useState(null);
  const [alert, setAlert] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showFormatGuide, setShowFormatGuide] = useState(false);

  // ローカルストレージから自動読み込み（重複除去付き）
  useEffect(() => {
    const cleanedData = loadFromStorage(STORAGE_KEY);
    setReferences(cleanedData);
  }, []);

  // 自動保存（ローカルストレージ）- 重複除去付き
  useEffect(() => {
    if (references.length > 0) {
      saveToStorage(STORAGE_KEY, references);
    }
  }, [references]);

  const addReference = (referenceData) => {
    const newReference = {
      id: uuidv4(),
      ...referenceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // 重複チェック（内容ベース）
    if (isDuplicate(references, newReference)) {
      showAlert('同じ内容の参考文献が既に存在します', 'error');
      return;
    }

    setReferences(prev => [...prev, newReference]);
    showAlert('参考文献を追加しました', 'success');
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
            if (!isDuplicate(references, ref)) {
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
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

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

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-main">
            <h1>📚 参考文献管理アプリ</h1>
            <p>学術論文の参考文献と引用を正しい形式で管理・生成</p>
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
        <div className={`alert alert-${alert.type}`}>
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
            onCopy={copyToClipboard}
          />
        </div>
      </div>

      <ReferenceTable
        references={references}
        onEdit={setSelectedReference}
        onDelete={deleteReference}
        onCopy={copyToClipboard}
      />

      <FormatGuideModal 
        isOpen={showFormatGuide}
        onClose={() => setShowFormatGuide(false)}
      />

      <Toast 
        message={toastMessage}
        isVisible={!!toastMessage}
        onClose={() => setToastMessage('')}
      />
    </div>
  );
}

export default App;
