import React, { useState, useEffect } from 'react';
import '../styles/MappingModal.css';

// Helpers: detect Japanese characters (kanji/kana)
const isJapaneseText = (s) => /[\u3000-\u30FF\u4E00-\u9FFF\u3040-\u309F]/.test(s);

// Convert katakana to hiragana and remove spaces
const toHiragana = (s) => {
    if (!s) return '';
    // normalize fullwidth spaces and standard spaces
    // NDLの読みは「ナツメ, ソウセキ」のように姓名をカンマで区切るため、カンマも区切りとして扱う
    let t = s.replace(/\u3000/g, ' ').replace(/[,，]/g, ' ').replace(/\s+/g, ' ').trim();
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
    if (len === 2) return [n.slice(0, 1), n.slice(1)]; // 1+1
    if (len === 3) return [n.slice(0, 1), n.slice(1)]; // 1+2
    if (len === 4) return [n.slice(0, 2), n.slice(2)]; // 2+2
    if (len === 5) return [n.slice(0, 2), n.slice(2)]; // 2+3
    if (len === 6) return [n.slice(0, 2), n.slice(2)]; // 2+4
    // default: split after 2
    return [n.slice(0, 2), n.slice(2)];
};

// 氏名を姓・名に分ける（「姓, 名」はカンマ、空白があれば空白、空白のない日本語名は文字数から推定）
const splitFullName = (fullName) => {
    const name = fullName.replace(/\u3000/g, ' ').trim();
    if (name.includes(',')) {
        const parts = name.split(',').map(s => s.trim());
        return [parts[0] || '', parts[1] || ''];
    }
    if (!name.includes(' ') && isJapaneseText(name)) {
        const parts = splitJapaneseName(name);
        return [parts[0] || '', parts[1] || ''];
    }
    const parts = name.split(/\s+/);
    return [parts[0] || '', parts.slice(1).join(' ') || ''];
};

const createEmptyAuthor = () => ({ lastName: '', firstName: '', reading: '' });

const MappingModal = ({ isOpen, onClose, apiData, onApply, referenceType }) => {
    // helper: extract creators/authors from a variety of possible keys
    const getCreators = (data) => {
        if (!data) return [];
        // helper to detect URL-only string
        const isUrl = (s) => (typeof s === 'string') && /^https?:\/\//.test(s);

        // prefer explicit dc:creator if present and non-empty
        if (Array.isArray(data['dc:creator']) && data['dc:creator'].length) {
            // filter out url-only entries if any
            const filtered = data['dc:creator'].filter(x => !(typeof x === 'string' && isUrl(x))).map(x => x);
            if (filtered.length) return filtered;
        }

        const candidates = ['creators', 'authors', 'dc:contributor', 'creator', 'author'];
        for (const k of candidates) {
            const v = data[k];
            if (Array.isArray(v) && v.length) {
                // map objects with @value/@id into strings when possible
                const mapped = v.map(x => {
                    if (typeof x === 'string') return x;
                    // NDLの { name, reading } は読みを使うためオブジェクトのまま残す
                    if (x && typeof x.name === 'string') return x;
                    if (x && typeof x === 'object') {
                        if (x['@value'] && typeof x['@value'] === 'string') return x['@value'];
                        if (x['@id'] && typeof x['@id'] === 'string') return x['@id'];
                        const s = Object.values(x).find(y => typeof y === 'string');
                        if (s) return s;
                    }
                    return null;
                }).filter(Boolean);
                // if array of strings but all are URLs, skip it
                if (mapped.length > 0 && mapped.every(x => isUrl(x))) continue;
                if (mapped.length) return mapped;
            }
            if (typeof v === 'string' && v.trim() !== '') {
                if (!isUrl(v)) return [v.trim()];
            }
        }

        // fallback: try to find any key that looks like a creator field
        for (const key of Object.keys(data)) {
            if (key.toLowerCase().includes('creator') || key.toLowerCase().includes('author')) {
                const v = data[key];
                if (Array.isArray(v) && v.length) {
                    const filtered = v.filter(x => !(typeof x === 'string' && isUrl(x)));
                    if (filtered.length) return filtered;
                }
                if (typeof v === 'string' && v.trim() !== '') {
                    if (!isUrl(v)) return [v.trim()];
                }
            }
        }
        return [];
    };

    const [mapping, setMapping] = useState({});
    // selectedCreators stores selected indices of the creators array
    const [selectedCreators, setSelectedCreators] = useState(new Set());
    // creatorsMeta: [{ idx, creator, name, reading }]
    const [creatorsMeta, setCreatorsMeta] = useState([]);
    // draftAuthors holds editable author fields keyed by index
    const [draftAuthors, setDraftAuthors] = useState({});
    // splitCounts stores the numeric "n" for 前からn文字で分割 per creator index
    const [splitCounts, setSplitCounts] = useState({});

    useEffect(() => {
        console.log('DEBUG MappingModal apiData:', apiData);
        console.log('DEBUG MappingModal creatorsMeta:', creatorsMeta);

        if (apiData) {
            const initialMapping = {};
            const fields = {
                'japanese-book': { title: 'title', publisher: 'publisher', year: 'year', authors: 'creators', isbn: 'isbn', link: 'link', doi: 'doi' },
                'english-book': { title: 'title', publisher: 'publisher', year: 'year', authors: 'creators', isbn: 'isbn', link: 'link', doi: 'doi' },
                'japanese-journal': { title: 'title', journalName: 'journal', publisher: 'publisher', volume: 'volume', issue: 'issue', pages: 'pages', year: 'year', authors: 'authors', link: 'link', doi: 'doi' },
                'organization-book': { title: 'title', organization: 'publisher', year: 'year', isbn: 'isbn', link: 'link', doi: 'doi' },
            };
            const typeFields = fields[referenceType] || {};

            Object.keys(typeFields).forEach(formField => {
                initialMapping[formField] = apiData[typeFields[formField]] || '';
            });

            // helper to try several candidate keys from apiData
            const getAny = (candidates) => {
                for (const k of candidates) {
                    if (!k) continue;
                    const v = apiData[k];
                    if (v !== undefined && v !== null && String(v) !== '') return v;
                }
                return '';
            };

            // fill common fields from alternative keys if empty
            initialMapping.title = initialMapping.title || getAny(['title', 'dc:title', 'dc:label']);
            initialMapping.publisher = initialMapping.publisher || getAny(['publisher', 'dc:publisher']);
            // for organization-book, prefer publisher/foaf agent name as organization
            if (referenceType === 'organization-book') {
                initialMapping.organization = initialMapping.organization || initialMapping.publisher || getAny(['organization', 'editorialOrganization']);
            }
            initialMapping.year = initialMapping.year || getAny(['year', 'prism:publicationDate', 'issued']);
            // 「2013.6」「2013-06」のような日付でも出版年の欄（数値入力）に入るよう、西暦4桁だけを取り出す
            const yearMatch = String(initialMapping.year).match(/\d{4}/);
            if (yearMatch) initialMapping.year = yearMatch[0];
            initialMapping.journalName = initialMapping.journalName || getAny(['journal', 'prism:publicationName', 'dc:source']);
            initialMapping.volume = initialMapping.volume || getAny(['volume', 'prism:volume']);
            initialMapping.issue = initialMapping.issue || getAny(['issue', 'prism:number', 'prism:issue']);
            initialMapping.pages = initialMapping.pages || getAny(['pages', 'prism:startingPage', 'prism:endingPage']);
            initialMapping.link = initialMapping.link || getAny(['link', 'seeAlso', 'rdfs:seeAlso', '@id', 'ndlLink']);
            initialMapping.doi = initialMapping.doi || getAny(['doi', 'dc:identifier']);

            const creatorsArr = getCreators(apiData);
            // helper: derive a display name (ignore pure URLs)
            const safeCreatorName = (c) => {
                if (c === null || c === undefined) return '';
                if (typeof c === 'string') {
                    const s = c.trim();
                    // if it's a URL, treat as empty
                    if (s.match(/^https?:\/\//)) return '';
                    return s;
                }
                // object with simple name property
                if (c.name && typeof c.name === 'string') {
                    const v = c.name.trim();
                    if (v.match(/^https?:\/\//)) return '';
                    return v;
                }
                // simple @value or language map
                if (c['@value'] && typeof c['@value'] === 'string') return c['@value'];
                if (c['@value'] && typeof c['@value'] === 'object') {
                    const vals = Object.values(c['@value']).filter(x => typeof x === 'string');
                    if (vals.length) return vals[0];
                }
                // search for any string property that is not a URL
                for (const v of Object.values(c)) {
                    if (typeof v === 'string' && !v.match(/^https?:\/\//) && v.trim() !== '') return v.trim();
                }
                return '';
            };

            // build creatorsMeta with original indices
            const meta = creatorsArr.map((creator, i) => ({ idx: i, creator, name: safeCreatorName(creator), reading: (creator && creator.reading) ? creator.reading : '' }));
            // default: select all creators that have a non-empty name
            setSelectedCreators(new Set(meta.filter(m => m.name).map(m => m.idx)));
            setCreatorsMeta(meta);
            // initialize draftAuthors from creators and compute initial splitCounts
            const initialDraft = {};
            const initialSplits = {};
            meta.forEach(({ name, reading }, creatorIdx) => {
                if (!name) {
                    // leave empty draft for URL-only or empty creators
                    initialDraft[creatorIdx] = createEmptyAuthor();
                    initialSplits[creatorIdx] = '';
                    return;
                }
                const [last, first] = splitFullName(name);
                initialDraft[creatorIdx] = { lastName: last, firstName: first, reading: toHiragana(reading) };
                // set initial split count to length of last (multi-byte aware) if available
                initialSplits[creatorIdx] = last ? Array.from(last).length : '';
            });
            setDraftAuthors(initialDraft);
            setSplitCounts(initialSplits);
            setMapping(initialMapping);
        }
    }, [apiData, referenceType]);

    // debug: log creatorsMeta whenever it updates
    useEffect(() => {
        console.log('DEBUG MappingModal creatorsMeta (updated):', creatorsMeta);
    }, [creatorsMeta]);

    if (!isOpen) return null;

    const handleApply = () => {
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

                // 下書きを全て消した場合は、取得した氏名から分割し直す
                // （画面に並べた著者と同じ配列を参照しないと、別の著者の名前を拾ってしまう）
                const meta = creatorsMeta[index];
                if (!meta || !meta.name) return createEmptyAuthor();
                const [last, first] = splitFullName(meta.name);
                return { lastName: last, firstName: first, reading: toHiragana(meta.reading) };
            });

        // Ensure link is also provided as `url` which is the form field key
        const mappingForApply = { ...mapping };
        if (mappingForApply.link && !mappingForApply.url) {
            mappingForApply.url = mappingForApply.link;
        }

        // If organization-book, set organization field instead of authors
        if (referenceType === 'organization-book') {
            const orgName = mappingForApply.organization || mappingForApply.publisher || '';
            onApply({ ...mappingForApply, organization: orgName });
        } else {
            onApply({ ...mappingForApply, authors });
        }
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
        const name = creatorsMeta[index]?.name;
        if (!name) return;
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
        const name = creatorsMeta[index]?.name;
        if (!name) return;
        const [last, first] = splitByFrontN(name, n);
        setDraftAuthors(prev => ({ ...prev, [index]: { ...(prev[index] || {}), lastName: last, firstName: first } }));
    };

    const renderField = (label, value) => (
        <div className="mapping-row" key={label}>
            <span className="mapping-label">{label}</span>
            <span className="mapping-value">
                {typeof value === 'string' && value.match(/^https?:\/\//) ? (
                    <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                ) : (
                    (value === null || value === undefined) ? '' : String(value)
                )}
            </span>
        </div>
    );

    const creators = getCreators(apiData);

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
                    {renderField('リンク', mapping.link)}
                    {mapping.doi && (
                        <div className="mapping-row" key="doi">
                            <span className="mapping-label">DOI</span>
                            <span className="mapping-value">
                                {typeof mapping.doi === 'string' && mapping.doi.match(/^10\./) ? (
                                    <a href={`https://doi.org/${mapping.doi}`} target="_blank" rel="noopener noreferrer">{mapping.doi}</a>
                                ) : (
                                    String(mapping.doi)
                                )}
                            </span>
                        </div>
                    )}

                    {creatorsMeta && creatorsMeta.length > 0 && (
                        <div className="mapping-creators">
                            <h4>著者を選択</h4>
                            {creatorsMeta.filter(m => m.name).map((m) => (
                                <div key={m.idx} className="creator-row">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedCreators.has(m.idx)}
                                            onChange={() => handleCreatorToggle(m.idx)}
                                        />
                                        {m.name || (typeof m.creator === 'string' ? (m.creator.match(/^https?:\/\//) ? '' : m.creator) : ((m.creator && (m.creator.name || m.creator['@id'])) || ''))}
                                        {m.reading ? ` (${m.reading})` : ''}
                                    </label>

                                    {/* editable fields for the draft author */}
                                    <div className="creator-edit-fields">
                                        <input
                                            type="text"
                                            value={draftAuthors[m.idx]?.lastName || ''}
                                            onChange={(e) => handleDraftChange(m.idx, 'lastName', e.target.value)}
                                            placeholder="姓"
                                        />
                                        <input
                                            type="text"
                                            value={draftAuthors[m.idx]?.firstName || ''}
                                            onChange={(e) => handleDraftChange(m.idx, 'firstName', e.target.value)}
                                            placeholder="名"
                                        />
                                        <input
                                            type="text"
                                            value={draftAuthors[m.idx]?.reading || ''}
                                            onChange={(e) => handleDraftChange(m.idx, 'reading', e.target.value)}
                                            placeholder="読み"
                                        />
                                        <div className="creator-split-controls">
                                            <input
                                                type="number"
                                                min="0"
                                                value={splitCounts[m.idx] === '' ? '' : splitCounts[m.idx]}
                                                onChange={(e) => handleSplitCountChange(m.idx, e.target.value)}
                                                placeholder="n"
                                                style={{ width: 60, marginLeft: 8 }}
                                            />
                                            <button type="button" onClick={() => handleSplit(m.idx)} style={{ marginLeft: 6 }}>分割</button>
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
