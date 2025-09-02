import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/library';

const APISearch = ({ type, onSearchResult, onCiniiResult }) => {
  const [isbn, setIsbn] = useState('');
  const [ciniiQuery, setCiniiQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanError, setScanError] = useState('');
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  const handleIsbnSearch = async () => {
    if (!isbn) return;
    setIsLoading(true);
    try {
      const result = await onSearchResult(isbn);
      if (!result) {
        alert('書籍情報が見つかりませんでした。');
      }
    } catch (error) {
      alert('書籍情報の取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  // Barcode scanner
  const openScanner = () => {
    setScanError('');
    setIsScannerOpen(true);
  };

  const closeScanner = async () => {
    setIsScannerOpen(false);
    try {
      if (codeReaderRef.current) {
        await codeReaderRef.current.reset();
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    if (!isScannerOpen) return;
    const formats = [BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.UPC_A, BarcodeFormat.QR_CODE];
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    const start = async () => {
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        const deviceId = videoInputDevices.length > 0 ? videoInputDevices[0].deviceId : null;
        await codeReader.decodeFromVideoDevice(deviceId, videoRef.current, (result, err) => {
          if (result) {
            let text = result.getText();
            // normalize ISBN-like values (remove hyphens/spaces)
            text = text.replace(/[-\s]/g, '');
            // EAN-13 -> possible ISBN-13
            if (text.length === 13 || text.length === 10) {
              setIsbn(text);
              closeScanner();
            }
          }
          if (err && !(err.name === 'NotFoundException')) {
            // other errors
            setScanError(err.message || String(err));
          }
        });
      } catch (e) {
        setScanError(e.message || String(e));
      }
    };

    start();

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, [isScannerOpen]);

  const handleCiniiSearch = async () => {
    if (!ciniiQuery) return;
    setIsLoading(true);
    try {
        await onCiniiResult(ciniiQuery);
    } catch (error) {
        alert('論文情報の検索に失敗しました。');
    } finally {
        setIsLoading(false);
    }
};

  if (type === 'japanese-book' || type === 'english-book') {
    return (
      <div className="api-search-container">
        <label>ISBNで書籍情報を検索</label>
        <div className="search-input-group">
          <input
            type="text"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            placeholder="ISBN (10桁または13桁)"
            disabled={isLoading}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleIsbnSearch}
            disabled={isLoading || !isbn}
          >
            {isLoading ? '検索中...' : '検索'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={openScanner}
            title="PCカメラでバーコードをスキャンしてISBNを入力"
          >
            バーコードスキャン
          </button>
        </div>

        {isScannerOpen && (
          <div className="scanner-modal" onClick={closeScanner}>
            <div className="scanner-content" onClick={(e) => e.stopPropagation()}>
              <video ref={videoRef} style={{ width: '100%', maxHeight: '400px' }} autoPlay muted playsInline />
              <div style={{ marginTop: 8 }}>
                <button className="btn btn-secondary" onClick={closeScanner}>閉じる</button>
                {scanError && <div className="error-message">スキャンエラー: {scanError}</div>}
                <div style={{ marginTop: 6, fontSize: 'smaller' }}>バーコードをカメラにかざしてください（EAN/UPC/ISBN）</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  if (type === 'japanese-journal') {
      return (
          <div className="api-search-container">
              <label>論文タイトルで検索</label>
              <div className="search-input-group">
                  <input
                      type="text"
                      value={ciniiQuery}
                      onChange={(e) => setCiniiQuery(e.target.value)}
                      placeholder="論文タイトルを入力..."
                      disabled={isLoading}
                  />
                  <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleCiniiSearch}
                      disabled={isLoading || !ciniiQuery}
                  >
                      {isLoading ? '検索中...' : 'CiNii検索'}
                  </button>
              </div>
          </div>
      );
  }

  return null;
};

export default APISearch;
