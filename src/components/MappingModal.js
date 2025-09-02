import React, { useState, useEffect } from 'react';
import '../styles/MappingModal.css';

// Helpers: detect Japanese characters (kanji/kana)
const isJapaneseText = (s) => /[\u3000-\u30FF\u4E00-\u9FFF\u3040-\u309F]/.test(s);

// Convert katakana to hiragana and remove spaces
const toHiragana = (s) => {
  if (!s) return '';
  // normalize fullwidth spaces and standard spaces
  let t = s.replace(/\u3000/g, ' ').replace(/\s+/g, ' ').trim();
  // convert katakana characters to hiragana
  let out = '';
  for (const ch of t) {
    const code = ch.charCodeAt(0);
    // Katakana block U+30A0 - U+30FF
    if (code >= 0x30A1 && code <= 0x30F4) {
      out += String.fromCharCode(code - 0x60);
    } else {
      out += ch;
    }
  }
  // remove spaces
  return out.replace(/\s+/g, '');
};

// Heuristic split for Japanese full-name strings (kanji/kana)
const splitJapaneseName = (name) => {
  const n = name.trim();
  const len = [...n].length; // support multi-byte
  if (len <= 2) {
    // fallback: 1 + rest
    return [n.slice(0, 1), n.slice(1) || ''];
  }
  if (len === 3) return [n.slice(0, 1), n.slice(1)]; // 1+2
  if (len === 4) return [n.slice(0, 2), n.slice(2)]; // 2+2
  if (len === 5) return [n.slice(0, 2), n.slice(2)]; // 2+3
  if (len === 6) return [n.slice(0, 2), n.slice(2)]; // 2+4
  // default: split after 2
  return [n.slice(0, 2), n.slice(2)];
};

const MappingModal = ({ isOpen, onClose, apiData, onApply, referenceType }) => {
  const [mapping, setMapping] = useState({});
  // selectedCreators stores selected indices of the creators array
  const [selectedCreators, setSelectedCreators] = useState(new Set());
  // draftAuthors holds editable author fields keyed by index
  const [draftAuthors, setDraftAuthors] = useState({});
  // splitCounts stores the numeric "n" for 前からn文字で分割 per creator index
  const [splitCounts, setSplitCounts] = useState({});

  useEffect(() => {
    if (apiData) {
      const initialMapping = {};
      const fields = {
        'japanese-book': { title: 'title', publisher: 'publisher', year: 'issued', authors: 'creators', isbn: 'isbn' },
        'english-book': { title: 'title', publisher: 'publisher', year: 'issued', authors: 'creators', isbn: 'isbn' },
        'japanese-journal': { title: 'title', journalName: 'journal', volume: 'volume', issue: 'issue', pages: 'pages', year: 'year', authors: 'authors' },
      };
      const typeFields = fields[referenceType] || {};

      Object.keys(typeFields).forEach(formField => {
        initialMapping[formField] = apiData[typeFields[formField]] || '';
      });

  const creatorsArr = apiData.creators || apiData.authors || [];
  // default: select all creators
  setSelectedCreators(new Set(creatorsArr.map((_, i) => i)));
  // initialize draftAuthors from creators and compute initial splitCounts
  const initialDraft = {};
  const initialSplits = {};
  creatorsArr.forEach((creator, idx) => {
        if (typeof creator === 'string') {
          const name = creator.trim();
          let last = '';
          let first = '';
          if (name.includes(',')) {
            const parts = name.split(',').map(s => s.trim());
            last = parts[0] || '';
            first = parts[1] || '';
          } else if (isJapaneseText(name)) {
            const parts = splitJapaneseName(name);
            last = parts[0] || '';
            first = parts[1] || '';
          } else {
            const parts = name.split(/\s+/);
            last = parts[0] || '';
            first = parts.slice(1).join(' ') || '';
          }
          initialDraft[idx] = { lastName: last, firstName: first, reading: '' };
          // set initial split count to length of last (multi-byte aware) if available
          initialSplits[idx] = last ? Array.from(String(last)).length : '';
        } else {
          const name = (creator.name || '').trim();
          let last = '';
          let first = '';
          if (name.includes(',')) {
            const parts = name.split(',').map(s => s.trim());
            last = parts[0] || '';
            first = parts[1] || '';
          } else if (isJapaneseText(name)) {
            const parts = splitJapaneseName(name);
            last = parts[0] || '';
            first = parts[1] || '';
          } else {
            const parts = name.split(/\s+/);
            last = parts[0] || '';
            first = parts.slice(1).join(' ') || '';
          }
          const rawReading = creator.reading || '';
          const normalizedReading = toHiragana(rawReading);
      initialDraft[idx] = { lastName: last, firstName: first, reading: normalizedReading };
      // set initial split count to length of last (multi-byte aware) if available
      initialSplits[idx] = last ? Array.from(String(last)).length : '';
        }
      });
    setDraftAuthors(initialDraft);
    setSplitCounts(initialSplits);
      setMapping(initialMapping);
    }
  }, [apiData, referenceType]);

  if (!isOpen) return null;

  const handleApply = () => {
    const creatorsArr = apiData?.creators || apiData?.authors || [];
    const authors = Array.from(selectedCreators)
      .sort((a, b) => a - b)
      .map(index => {
        // prefer user-edited draft if present
        const draft = draftAuthors[index];
        if (draft && (draft.lastName || draft.firstName || draft.reading)) {
          return {
            lastName: draft.lastName || '',
            firstName: draft.firstName || '',
            reading: draft.reading ? toHiragana(draft.reading) : ''
          };
        }

        const creator = creatorsArr[index];
        if (!creator) return { lastName: '', firstName: '', reading: '' };

        if (typeof creator === 'string') {
          const name = creator.trim();
          let last = '';
          let first = '';
          if (name.includes(',')) {
            const parts = name.split(',').map(s => s.trim());
            last = parts[0] || '';
            first = parts[1] || '';
          } else if (isJapaneseText(name)) {
            const parts = splitJapaneseName(name);
            last = parts[0] || '';
            first = parts[1] || '';
          } else {
            const parts = name.split(/\s+/);
            last = parts[0] || '';
            first = parts.slice(1).join(' ') || '';
          }
          return { lastName: last, firstName: first, reading: '' };
        }

        // creator is object like {name, reading}
        const name = (creator.name || '').trim();
        let last = '';
        let first = '';
        if (name.includes(',')) {
          const parts = name.split(',').map(s => s.trim());
          last = parts[0] || '';
          first = parts[1] || '';
        } else if (isJapaneseText(name)) {
          const parts = splitJapaneseName(name);
          last = parts[0] || '';
          first = parts[1] || '';
        } else {
          const parts = name.split(/\s+/);
          last = parts[0] || '';
          first = parts.slice(1).join(' ') || '';
        }
        const rawReading = creator.reading || '';
        const normalizedReading = toHiragana(rawReading);
        return { lastName: last, firstName: first, reading: normalizedReading };
      });

    onApply({ ...mapping, authors });
    onClose();
  };

  const handleCreatorToggle = (index) => {
    setSelectedCreators(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) newSet.delete(index); else newSet.add(index);
      return newSet;
    });
  };

  const handleDraftChange = (index, field, value) => {
    setDraftAuthors(prev => ({ ...prev, [index]: { ...(prev[index] || {}), [field]: value } }));
  };

  const handleSplitCountChange = (index, value) => {
    // keep numeric or empty
    const v = value === '' ? '' : Math.max(0, parseInt(value, 10) || 0);
  setSplitCounts(prev => ({ ...prev, [index]: v }));
  // auto-split immediately on change
  // use timeout to allow users to type; but for now immediate
  const creatorsArr = apiData?.creators || apiData?.authors || [];
  const creator = creatorsArr[index];
  if (!creator) return;
  const name = (typeof creator === 'string') ? creator : (creator.name || '');
  const [last, first] = splitByFrontN(name, v);
  setDraftAuthors(prev => ({ ...prev, [index]: { ...(prev[index] || {}), lastName: last, firstName: first } }));
  };

  const splitByFrontN = (s, n) => {
    if (!s) return ['', ''];
    const chars = Array.from(s.trim()); // multi-byte safe
    if (!n || n <= 0) return ['', s.trim()];
    const last = chars.slice(0, n).join('');
    const first = chars.slice(n).join('');
    return [last, first];
  };

  const handleSplit = (index) => {
    const n = splitCounts[index] || 0;
    const creatorsArr = apiData?.creators || apiData?.authors || [];
    const creator = creatorsArr[index];
    if (!creator) return;
    const name = (typeof creator === 'string') ? creator : (creator.name || '');
    const [last, first] = splitByFrontN(name, n);
    setDraftAuthors(prev => ({ ...prev, [index]: { ...(prev[index] || {}), lastName: last, firstName: first } }));
  };

  const renderField = (label, value) => (
    <div className="mapping-row" key={label}>
      <span className="mapping-label">{label}</span>
      <span className="mapping-value">{value}</span>
    </div>
  );

  const creators = apiData?.creators || apiData?.authors || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>取得した書誌情報をマッピング</h2>
        </div>
        <div className="modal-body">
          {renderField('タイトル', mapping.title)}
          {renderField('出版社', mapping.publisher)}
          {renderField('出版年', mapping.year)}
          {renderField('雑誌名', mapping.journalName)}
          {renderField('巻', mapping.volume)}
          {renderField('号', mapping.issue)}
          {renderField('ページ', mapping.pages)}

          {creators.length > 0 && (
            <div className="mapping-creators">
              <h4>著者を選択</h4>
              {creators.map((creator, index) => (
                <div key={index} className="creator-row">
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedCreators.has(index)}
                      onChange={() => handleCreatorToggle(index)}
                    />
                    {typeof creator === 'string' ? creator : (creator.name || '')}
                    {typeof creator !== 'string' && creator.reading ? ` (${creator.reading})` : ''}
                  </label>

                  {/* editable fields for the draft author */}
                  <div className="creator-edit-fields">
                    <input
                      type="text"
                      value={draftAuthors[index]?.lastName || ''}
                      onChange={(e) => handleDraftChange(index, 'lastName', e.target.value)}
                      placeholder="姓"
                    />
                    <input
                      type="text"
                      value={draftAuthors[index]?.firstName || ''}
                      onChange={(e) => handleDraftChange(index, 'firstName', e.target.value)}
                      placeholder="名"
                    />
                    <input
                      type="text"
                      value={draftAuthors[index]?.reading || ''}
                      onChange={(e) => handleDraftChange(index, 'reading', e.target.value)}
                      placeholder="読み"
                    />
                    <div className="creator-split-controls">
                      <input
                        type="number"
                        min="0"
                        value={splitCounts[index] === '' ? '' : splitCounts[index]}
                        onChange={(e) => handleSplitCountChange(index, e.target.value)}
                        placeholder="n"
                        style={{ width: 60, marginLeft: 8 }}
                      />
                      <button type="button" onClick={() => handleSplit(index)} style={{ marginLeft: 6 }}>分割</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>キャンセル</button>
          <button className="btn btn-primary" onClick={handleApply}>フォームに反映</button>
        </div>
      </div>
    </div>
  );
};

export default MappingModal;
