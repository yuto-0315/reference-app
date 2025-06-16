import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ReferenceForm from './components/ReferenceForm';
import ReferenceTable from './components/ReferenceTable';
import PreviewSection from './components/PreviewSection';
import FileControls from './components/FileControls';
import ThemeToggle from './components/ThemeToggle';
import FormatGuideModal from './components/FormatGuideModal';
import { formatCitation, formatReference, getReferenceTypeFields } from './utils/formatters';

const STORAGE_KEY = 'reference-app-data';

function App() {
  const [references, setReferences] = useState([]);
  const [selectedReference, setSelectedReference] = useState(null);
  const [alert, setAlert] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [showFormatGuide, setShowFormatGuide] = useState(false);

  // ローカルストレージから自動読み込み
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setReferences(parsedData);
      } catch (error) {
        console.error('ローカルストレージからの読み込みエラー:', error);
      }
    }
  }, []);

  // 自動保存（ローカルストレージ）
  useEffect(() => {
    if (references.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(references));
    }
  }, [references]);

  const addReference = (referenceData) => {
    const newReference = {
      id: uuidv4(),
      ...referenceData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setReferences(prev => [...prev, newReference]);
    showAlert('参考文献を追加しました', 'success');
  };

  const updateReference = (id, referenceData) => {
    setReferences(prev => prev.map(ref => 
      ref.id === id 
        ? { ...ref, ...referenceData, updatedAt: new Date().toISOString() }
        : ref
    ));
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
    const dataStr = JSON.stringify(references, null, 2);
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
          // 既存のIDと重複しないように新しいIDを生成
          const newReferences = importedData.map(ref => ({
            ...ref,
            id: uuidv4(),
            importedAt: new Date().toISOString()
          }));
          setReferences(prev => [...prev, ...newReferences]);
          showAlert(`${newReferences.length}件の参考文献をインポートしました`, 'success');
        } else {
          showAlert('無効なJSONファイルです', 'error');
        }
      } catch (error) {
        showAlert('JSONファイルの読み込みに失敗しました', 'error');
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
      setCopyFeedback(feedbackMessage);
      setTimeout(() => setCopyFeedback(''), 2000);
    }).catch(() => {
      showAlert('コピーに失敗しました', 'error');
    });
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

      {copyFeedback && (
        <div className="copy-feedback">
          {copyFeedback}
        </div>
      )}

      <FileControls 
        onExport={exportToJSON}
        onImport={importFromJSON}
        referenceCount={references.length}
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
    </div>
  );
}

export default App;
