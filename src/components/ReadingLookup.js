import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Search } from 'lucide-react';
import { lookupReadingCandidates, canLookupReading } from '../utils/nameReading';
import { describeApiErrorReason } from '../utils/apiErrors';

const targetKey = ({ kind, name, lastName, firstName }) => [kind, name, lastName, firstName].map(s => (s || '').trim()).join('|');
const describeTarget = ({ kind, name, lastName, firstName }) => (kind === 'person' ? `${lastName || ''} ${firstName || ''}`.trim() : name);

// 著者名・団体名の読み仮名を国立国会図書館の典拠データから調べ、選んだ読みを入力欄に入れる。
// 読みが1通りに決まるなら、選ぶ手間を省いてそのまま入れる（入れた読みは表示するので、違えば直せる）
const ReadingLookup = ({ target, onPick, className = '' }) => {
  const [status, setStatus] = useState('idle'); // idle | loading | done | error
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState('');
  const latestKeyRef = useRef(targetKey(target));

  // 名前を書き換えたら、前の名前の結果は当てはまらないので消す
  const currentKey = targetKey(target);
  useEffect(() => {
    latestKeyRef.current = currentKey;
    setStatus('idle');
    setCandidates([]);
    setMessage('');
  }, [currentKey]);

  const pick = (candidate) => {
    onPick(candidate.reading);
    setCandidates([]);
    setMessage(`典拠データの読み「${candidate.reading}」を入れました（${candidate.label}）。違う場合は直接書き直してください。`);
  };

  const lookup = async () => {
    const requestedKey = currentKey;
    setStatus('loading');
    setMessage('');
    setCandidates([]);
    try {
      const results = await lookupReadingCandidates(target);
      // 調べている間に名前が書き換えられたら、古い結果は使わない
      if (latestKeyRef.current !== requestedKey) return;
      setStatus('done');
      if (results.length === 0) {
        setMessage(`国立国会図書館の典拠データに「${describeTarget(target)}」は見つかりませんでした。読み仮名を直接入力してください。`);
      } else if (new Set(results.map(result => result.reading)).size === 1) {
        // 同姓同名の別人など候補が複数でも、読みが同じなら選んでもらう必要はない
        pick(results[0]);
      } else {
        setCandidates(results);
        setMessage(`候補が${results.length}件あります。当てはまる読みを選んでください。`);
      }
    } catch (error) {
      if (latestKeyRef.current !== requestedKey) return;
      setStatus('error');
      setMessage(`読み仮名を調べられませんでした（${describeApiErrorReason(error)}）。読み仮名は直接入力できます。`);
    }
  };

  const isLoading = status === 'loading';
  return (
    <div className={`reading-lookup ${className}`}>
      <button
        type="button"
        className="btn btn-small btn-secondary"
        onClick={lookup}
        disabled={isLoading || !canLookupReading(target)}
        title={canLookupReading(target) ? '国立国会図書館の典拠データから読み仮名を調べる' : (target.kind === 'person' ? '先に姓を入力してください' : '先に名前を入力してください')}
      >
        {isLoading ? <Loader2 size={14} className="spin" /> : <Search size={14} />}
        {isLoading ? '調べています…' : '読みを調べる'}
      </button>
      {candidates.length > 0 && (
        <ul className="reading-candidates" aria-label="読み仮名の候補">
          {candidates.map(candidate => (
            <li key={`${candidate.label}-${candidate.reading}`}>
              <button type="button" className="reading-candidate" onClick={() => pick(candidate)}>
                <span className="reading-candidate-reading">{candidate.reading}</span>
                <span className="reading-candidate-label">{candidate.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className={`reading-lookup-message${status === 'error' ? ' is-error' : ''}`} aria-live="polite">{message}</p>
    </div>
  );
};

export default ReadingLookup;
