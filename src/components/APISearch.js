import React, { useState, useRef, useEffect } from 'react';
import { BrowserMultiFormatReader, NotFoundException, ChecksumException, FormatException } from '@zxing/library';
import useEscapeKey from '../hooks/useEscapeKey';

// 日本の書籍のバーコードは2段あり、下段（192 で始まる分類・価格コード）を読んでも検索できないため、
// ISBN-13（978/979 で始まる）と ISBN-10 だけを受け付ける
const isIsbnCode = (code) => /^97[89]\d{10}$/.test(code) || /^\d{9}[\dX]$/i.test(code);

// バーコードがまだ映っていない・読み取りかけのときに毎フレーム返る例外。利用者に見せるエラーではない
// （本番ビルドではクラス名が短縮されるため、err.name ではなく instanceof で判定する）
const isScanInProgressError = (err) =>
  err instanceof NotFoundException || err instanceof ChecksumException || err instanceof FormatException;

const APISearch = ({ type, onSearchResult, onCiniiResult, idPrefix = '' }) => {
  const [isbn, setIsbn] = useState('');
  const [ciniiQuery, setCiniiQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scanError, setScanError] = useState('');
  const videoRef = useRef(null);
  const codeReaderRef = useRef(null);

  const handleIsbnSearch = async (isbnToSearch = isbn) => {
    if (!isbnToSearch) return;
    setIsLoading(true);
    setSearchError('');
    try {
      const result = await onSearchResult(isbnToSearch);
      if (!result) {
        setSearchError('書籍情報が見つかりませんでした。ISBNの数字を確かめるか、下の各項目を直接入力してください。');
      }
    } catch (error) {
      setSearchError('書籍情報を取得できませんでした。通信状況を確かめて、もう一度お試しください。');
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

  useEscapeKey(isScannerOpen, closeScanner);

  // 文献の種類を変えると検索欄ごと消えるため、カメラを使ったままにしない
  useEffect(() => {
    setIsScannerOpen(false);
    setSearchError('');
  }, [type]);

  useEffect(() => {
    if (!isScannerOpen) return;
    const codeReader = new BrowserMultiFormatReader();
    codeReaderRef.current = codeReader;

    const start = async () => {
      try {
        const videoInputDevices = await codeReader.listVideoInputDevices();
        const deviceId = videoInputDevices.length > 0 ? videoInputDevices[0].deviceId : null;
        await codeReader.decodeFromVideoDevice(deviceId, videoRef.current, (result, err) => {
          if (result) {
            // normalize ISBN-like values (remove hyphens/spaces)
            const code = result.getText().replace(/[-\s]/g, '');
            if (isIsbnCode(code)) {
              setIsbn(code);
              closeScanner();
              // スキャンの目的は検索なので、読み取れたらそのまま検索する
              handleIsbnSearch(code);
            }
          }
          if (err && !isScanInProgressError(err)) {
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
    setSearchError('');
    try {
      await onCiniiResult(ciniiQuery);
    } catch (error) {
      setSearchError('論文情報を検索できませんでした。通信状況を確かめて、もう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  // 検索欄は参考文献フォームの中にあるため、Enterで文献の追加が走らないよう検索に置き換える
  // 日本語入力の変換を確定する Enter では検索しない（Safari は isComposing が false のまま keyCode 229 を送ることがある）
  const searchOnEnter = (search) => (e) => {
    if (e.key !== 'Enter' || e.nativeEvent.isComposing || e.keyCode === 229) return;
    e.preventDefault();
    search();
  };

  // 検索結果のエラーは、操作した検索欄のすぐ下に出す
  const searchErrorMessage = searchError && (
    <div id={`${idPrefix}api-search-error`} className="error-message" role="alert">{searchError}</div>
  );

  // Allow ISBN lookup for normal books and organization-published books
  if (type === 'japanese-book' || type === 'english-book' || type === 'organization-book') {
    return (
      <div className="api-search-container">
        <label htmlFor={`${idPrefix}isbn-search`}>ISBNで書籍情報を検索</label>
        <div className="search-input-group">
          <input
            id={`${idPrefix}isbn-search`}
            type="text"
            inputMode="numeric"
            value={isbn}
            onChange={(e) => { setIsbn(e.target.value); setSearchError(''); }}
            onKeyDown={searchOnEnter(() => handleIsbnSearch())}
            placeholder="ISBN (10桁または13桁)"
            disabled={isLoading}
            aria-describedby={searchError ? `${idPrefix}api-search-error` : undefined}
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleIsbnSearch()}
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
        {searchErrorMessage}

        {isScannerOpen && (
          <div className="scanner-modal" onClick={closeScanner}>
            <div className="scanner-content" onClick={(e) => e.stopPropagation()}>
              <video ref={videoRef} style={{ width: '100%', maxHeight: '400px' }} autoPlay muted playsInline />
              <div style={{ marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={closeScanner}>閉じる</button>
                {scanError && <div className="error-message" role="alert">スキャンエラー: {scanError}</div>}
                <div style={{ marginTop: 6, fontSize: 'smaller' }}>本の裏表紙にある上段のバーコード（978 で始まる ISBN）をカメラにかざしてください</div>
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
        <label htmlFor={`${idPrefix}cinii-search`}>論文タイトルで検索</label>
        <div className="search-input-group">
          <input
            id={`${idPrefix}cinii-search`}
            type="text"
            value={ciniiQuery}
            onChange={(e) => { setCiniiQuery(e.target.value); setSearchError(''); }}
            onKeyDown={searchOnEnter(handleCiniiSearch)}
            placeholder="論文タイトルを入力..."
            disabled={isLoading}
            aria-describedby={searchError ? `${idPrefix}api-search-error` : undefined}
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
        {searchErrorMessage}
      </div>
    );
  }

  return null;
};

export default APISearch;
