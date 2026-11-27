import React from 'react';

const STORAGE_KEY = 'reference-app-data';

// 画面の表示中に想定外のエラーが起きても真っ白にせず、データが無事なことと、次にできることを伝える
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // 画面が壊れていてもデータだけは持ち出せるよう、保存されている内容をそのままファイルにする
  downloadSavedData = () => {
    let savedData = '';
    try {
      savedData = localStorage.getItem(STORAGE_KEY) || '[]';
    } catch (error) {
      savedData = '[]';
    }
    const url = URL.createObjectURL(new Blob([savedData], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'references_backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="app error-screen" role="alert">
        <h1>画面を表示できませんでした</h1>
        <p>登録した文献はブラウザに保存されたままです。次の順にお試しください。</p>
        <ol>
          <li>「データをファイルに保存」で、今のデータを手元に残す</li>
          <li>「再読み込み」でページを開き直す</li>
          <li>直前にJSONを読み込んでいた場合は、別のファイル（以前に「ファイルに保存」したもの）を読み込む</li>
        </ol>
        <div className="button-group">
          <button type="button" className="btn btn-primary" onClick={this.downloadSavedData}>データをファイルに保存</button>
          <button type="button" className="btn btn-secondary" onClick={() => window.location.reload()}>再読み込み</button>
        </div>
      </main>
    );
  }
}

export default ErrorBoundary;
