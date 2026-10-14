import React, { useState, useEffect } from 'react';
import { REFERENCE_TYPES, REFERENCE_TYPE_HINTS, getReferenceTypeFields } from '../utils/formatters';
import InfoTooltip from './InfoTooltip';
import APISearch from './APISearch';
import MappingModal from './MappingModal';
import SearchResultsModal from './SearchResultsModal';
import { fetchBookInfoByISBN, searchCiNiiByTitle, fetchCiNiiArticleDetails } from '../utils/api';
import { Lightbulb } from 'lucide-react';

const createEmptyAuthor = () => ({ lastName: '', firstName: '', reading: '' });

// 空白だけの入力も未入力として扱う
const isBlank = (value) => value === undefined || value === null || String(value).trim() === '';

const ReferenceForm = ({ onSubmit, initialData, onCancel, onDirtyChange }) => {
  // 初期データの著者フィールド設定を調整
  const getInitialFormData = () => {
    const baseData = {
      type: 'japanese-book',
      ...initialData
    };

    // 著者フィールドがある文献タイプの場合のみ著者を設定
    const fields = getReferenceTypeFields(baseData.type);
    const hasAuthorsField = fields.some(field => field.key === 'authors');

    if (hasAuthorsField && (!baseData.authors || baseData.authors.length === 0)) {
      baseData.authors = [{ lastName: '', firstName: '', reading: '' }];
    }

    // 翻訳書の場合は原著者と訳者フィールドを初期化
    if (baseData.type === 'translation') {
      if (!baseData.originalAuthors || baseData.originalAuthors.length === 0) {
        baseData.originalAuthors = [{ lastName: '', firstName: '', reading: '' }];
      }
      if (!baseData.originalAuthorsEnglish || baseData.originalAuthorsEnglish.length === 0) {
        baseData.originalAuthorsEnglish = [{ lastName: '', firstName: '', reading: '' }];
      }
      if (!baseData.translators || baseData.translators.length === 0) {
        baseData.translators = [{ lastName: '', firstName: '', reading: '' }];
      }
    }

    return baseData;
  };

  const [formData, setFormData] = useState(getInitialFormData());
  // 読み込んだ直後（または追加・更新直後）の内容。これと違えば「入力途中」とみなす
  const [baselineData, setBaselineData] = useState(formData);
  const [errors, setErrors] = useState({});
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [ciniiResults, setCiniiResults] = useState([]);

  // 編集をキャンセルしてもフォームの内容は残す（似た文献を複製して追加する使い方ができるように）
  useEffect(() => {
    if (initialData) {
      // 著者欄のない文献種別に空の著者を持たせないよう、初期化ロジックを共通化する
      const loadedData = getInitialFormData();
      setFormData(loadedData);
      setBaselineData(loadedData);
      setErrors({});
    }
  }, [initialData]);

  // 別の文献の編集に切り替えるとき、書きかけの内容を黙って消さないよう、入力途中かどうかを親に伝える
  useEffect(() => {
    onDirtyChange?.(JSON.stringify(formData) !== JSON.stringify(baselineData));
  }, [formData, baselineData, onDirtyChange]);

  const fields = getReferenceTypeFields(formData.type);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const handleTypeChange = (newType) => {
    const newFields = getReferenceTypeFields(newType);
    const currentFieldTypes = Object.fromEntries(fields.map(field => [field.key, field.type]));

    // 種類を選び直しても、両方の種類にある項目（書名・出版年など）の入力内容は引き継ぐ
    // 同じキーでも入力形式が違う項目（訳者名：文字列 / 訳者：著者リスト）は壊れるので引き継がない
    const carriedOverData = Object.fromEntries(
      newFields
        .filter(field => currentFieldTypes[field.key] === field.type && formData[field.key] !== undefined)
        .map(field => [field.key, formData[field.key]])
    );

    const newFormData = {
      type: newType,
      ...carriedOverData
    };

    // 著者フィールドがある場合のみ著者を初期化
    const hasAuthorsField = newFields.some(field => field.key === 'authors');
    if (hasAuthorsField && !newFormData.authors?.length) {
      newFormData.authors = [createEmptyAuthor()];
    }

    // 翻訳書の場合は原著者と訳者フィールドを初期化
    if (newType === 'translation') {
      ['originalAuthors', 'originalAuthorsEnglish', 'translators'].forEach(key => {
        if (!newFormData[key]?.length) {
          newFormData[key] = [createEmptyAuthor()];
        }
      });
    }

    setFormData(newFormData);
    setErrors({});
  };

  const handleAuthorChange = (index, field, value) => {
    const updatedAuthors = [...formData.authors];
    updatedAuthors[index] = { ...updatedAuthors[index], [field]: value };
    setFormData(prev => ({ ...prev, authors: updatedAuthors }));

    // エラーをクリア
    if (errors[`authors.${index}.${field}`]) {
      setErrors(prev => ({ ...prev, [`authors.${index}.${field}`]: null }));
    }
  };

  // 汎用的な著者フィールド変更処理
  const handleAuthorFieldChange = (fieldName, index, field, value) => {
    const updatedAuthors = [...(formData[fieldName] || [])];
    updatedAuthors[index] = { ...updatedAuthors[index], [field]: value };
    setFormData(prev => ({ ...prev, [fieldName]: updatedAuthors }));

    // エラーをクリア
    if (errors[`${fieldName}.${index}.${field}`]) {
      setErrors(prev => ({ ...prev, [`${fieldName}.${index}.${field}`]: null }));
    }
  };

  const addAuthor = () => {
    setFormData(prev => ({
      ...prev,
      authors: [...(prev.authors || []), createEmptyAuthor()]
    }));
    setErrors(prev => ({ ...prev, authors: null }));
  };

  const addAuthorField = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), createEmptyAuthor()]
    }));
    setErrors(prev => ({ ...prev, [fieldName]: null }));
  };

  const removeAuthor = (index) => {
    if (formData.authors.length > 1) {
      const updatedAuthors = formData.authors.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, authors: updatedAuthors }));
    }
  };

  const removeAuthorField = (fieldName, index) => {
    const currentAuthors = formData[fieldName] || [];
    if (currentAuthors.length > 1) {
      const updatedAuthors = currentAuthors.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, [fieldName]: updatedAuthors }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // 著者・原著者・訳者の一覧を検証する。書誌情報の取り込みなどで1人もいなくなった場合も未入力として扱う
    const validatePeople = (fieldName, listLabel, messagePrefix) => {
      const people = formData[fieldName];
      if (!Array.isArray(people) || people.length === 0) {
        newErrors[fieldName] = `${listLabel}を1人以上入力してください`;
        return;
      }
      people.forEach((person, index) => {
        if (isBlank(person.lastName)) {
          newErrors[`${fieldName}.${index}.lastName`] = `${messagePrefix}姓は必須項目です`;
        }
        if (isBlank(person.firstName)) {
          // 以前の形式のデータ（訳者など）は氏名がまとめて姓の欄に入っているため、分け方を案内する
          newErrors[`${fieldName}.${index}.firstName`] = isBlank(person.lastName)
            ? `${messagePrefix}名は必須項目です`
            : `${messagePrefix}名は必須項目です。姓の欄に氏名がまとめて入っている場合は、姓と名に分けて入力してください`;
        }
      });
    };

    // 著者フィールドがある文献タイプの場合のみ著者の検証を行う
    const authorsField = fields.find(field => field.key === 'authors');
    if (authorsField) {
      validatePeople('authors', authorsField.label, '');
    }
    // 翻訳書の場合は原著者と訳者の検証を行う
    if (formData.type === 'translation') {
      validatePeople('originalAuthors', '原著者（日本語表記）', '原著者（日本語）の');
      validatePeople('originalAuthorsEnglish', '原著者（原語表記）', '原著者（原語）の');
      validatePeople('translators', '訳者', '訳者の');
    }
    // Webサイトの場合は「出版年」「ページ」不要なのでバリデーション不要
    // その他のフィールドの検証
    fields.forEach(field => {
      if (field.type === 'authors' || field.type === 'translation-authors') return; // 上で処理済み
      if (formData.type === 'website' && (field.key === 'year' || field.key === 'pages')) return;
      const value = formData[field.key];
      if (field.required && isBlank(value)) {
        newErrors[field.key] = `${field.label}は必須項目です`;
      }
      if (field.type === 'url' && !isBlank(value) && !/^https?:\/\/.+/.test(String(value))) {
        newErrors[field.key] = '有効なURLを入力してください（http://またはhttps://で始まる）';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // 重複などで追加できなかった場合は、入力内容を消さずに修正できるようにする
      if (onSubmit(formData) === false) return;
      // 新規追加・編集問わずフォームをリセット
      const resetData = { type: 'japanese-book' };
      // 日本語書籍は著者フィールドがあるので著者を初期化
      resetData.authors = [{ lastName: '', firstName: '', reading: '' }];

      setFormData(resetData);
      setBaselineData(resetData);
      setErrors({});
    }
  };


  const handleIsbnSearchResult = async (isbn) => {
    const data = await fetchBookInfoByISBN(isbn);
    if (data) {
      setApiData(data);
      setShowMappingModal(true);
    }
    return !!data;
  };

  const handleCiniiSearchResult = async (query) => {
    const results = await searchCiNiiByTitle(query);
    setCiniiResults(results);
    setShowResultsModal(true);
  };

  // 取得できなかった項目（空文字・空の配列）で、入力済みの著者や巻号を消さない
  const handleApplyMapping = (mappedData) => {
    const filledData = Object.fromEntries(
      Object.entries(mappedData).filter(([, value]) => {
        if (value === null || value === undefined) return false;
        if (Array.isArray(value)) return value.length > 0;
        return String(value).trim() !== '';
      })
    );
    setFormData(prev => ({ ...prev, ...filledData }));
  };

  const handleSelectCiniiResult = (result) => {
    // fetch detailed article info (authors etc.) if possible, then open mapping modal
    (async () => {
      try {
        const details = await fetchCiNiiArticleDetails(result.seeAlso || result.link);
        // merge details into result but do not overwrite non-empty result fields with empty values from details
        const merged = { ...result };
        if (details) {
          for (const k of Object.keys(details)) {
            const v = details[k];
            // skip null/undefined
            if (v === null || v === undefined) continue;
            // skip empty strings
            if (typeof v === 'string' && v.trim() === '') continue;
            // skip empty arrays
            if (Array.isArray(v) && v.length === 0) continue;
            // otherwise use details' value
            merged[k] = v;
          }
        }

        // if details contains explicit creators/authors, decide whether to prefer them
        const detailAuthors = details && (details['dc:creator'] || details.creators || details.authors);
        const resultAuthors = result['dc:creator'] || result.creators || result.authors || merged.creators || merged.authors || [];
        if (detailAuthors) {
          const isUrl = (s) => typeof s === 'string' && /^https?:\/\//.test(s);
          const detailAllUrls = Array.isArray(detailAuthors) && detailAuthors.length > 0 && detailAuthors.every(a => isUrl(a));
          const resultHasNames = Array.isArray(resultAuthors) && resultAuthors.some(a => (typeof a === 'string' && !isUrl(a)) || (a && a.name));

          if (detailAllUrls && resultHasNames) {
            // keep original human-readable authors from search result
            merged.creators = resultAuthors;
            merged.authors = resultAuthors;
          } else {
            // otherwise prefer the detailed authors (mapped already into merged by above loop)
            // ensure creators/authors fields exist
            if (details['dc:creator'] && Array.isArray(details['dc:creator'])) {
              merged.creators = details['dc:creator'];
              merged.authors = details['dc:creator'];
            } else if (details.creators) {
              merged.creators = details.creators;
              merged.authors = details.creators;
            } else if (details.authors) {
              merged.creators = details.authors;
              merged.authors = details.authors;
            }
          }
        }

        setApiData(merged);
      } catch (e) {
        // fallback: use the search result as-is
        setApiData(result);
      }
      setShowResultsModal(false);
      setShowMappingModal(true);
    })();
  };

  const renderField = (field) => {
    const { key, label, required, type, description, example } = field;

    if (key === 'authors') {
      // 英語文献の場合は読み仮名を非表示にする
      const isEnglish = ['english-book', 'english-journal', 'english-chapter'].includes(formData.type);
      return renderAuthorsField(label, !isEnglish);
    }

    // 翻訳書の特別なフィールド処理
    if (type === 'translation-authors') {
      // 原著者（英語）の場合は読み仮名を非表示
      const showReading = key !== 'originalAuthorsEnglish';
      return renderTranslationAuthorsField(key, label, showReading);
    }

    // 執筆団体（読み仮名）など、その他のテキストフィールド
    const value = formData[key] || '';
    const error = errors[key];
    const inputId = `reference-field-${key}`;

    const errorId = `${inputId}-error`;
    // 読み上げでも必須・エラーの状態と内容が伝わるようにする
    const accessibilityProps = {
      'aria-required': required || undefined,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? errorId : undefined,
    };

    return (
      <div key={key} className="form-group">
        {/* 入力ガイドのボタンを label の中に入れると、ラベルのクリックと競合するため横に並べる */}
        <div className="label-row">
          <label htmlFor={inputId}>
            {label}
            {required && <span className="required-mark"> *</span>}
          </label>
          <InfoTooltip description={description} example={example} fieldLabel={label} />
        </div>
        {type === 'textarea' ? (
          <textarea
            id={inputId}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className={error ? 'error' : ''}
            rows={3}
            {...accessibilityProps}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className={error ? 'error' : ''}
            placeholder={field.placeholder || ''}
            {...accessibilityProps}
          />
        )}
        {error && <div id={errorId} className="error-message">{error}</div>}
      </div>
    );
  };

  const renderAuthorsField = (label, showReading = true) => {
    return (
      <div key="authors" className="form-group">
        <label>
          {label} <span className="required-mark">*</span>
        </label>
        {errors.authors && <div className="error-message" role="alert">{errors.authors}</div>}
        {(formData.authors || []).map((author, index) => (
          <div key={index} className="author-input-group">
            <div className="author-fields">
              <div className="author-field">
                <label htmlFor={`authors-${index}-lastName`}>姓 *</label>
                <input
                  id={`authors-${index}-lastName`}
                  type="text"
                  value={author.lastName}
                  onChange={(e) => handleAuthorChange(index, 'lastName', e.target.value)}
                  className={errors[`authors.${index}.lastName`] ? 'error' : ''}
                  aria-required="true"
                  aria-invalid={errors[`authors.${index}.lastName`] ? true : undefined}
                  placeholder="山田"
                />
                {errors[`authors.${index}.lastName`] && (
                  <div className="error-message">{errors[`authors.${index}.lastName`]}</div>
                )}
              </div>
              <div className="author-field">
                <label htmlFor={`authors-${index}-firstName`}>名 *</label>
                <input
                  id={`authors-${index}-firstName`}
                  type="text"
                  value={author.firstName}
                  onChange={(e) => handleAuthorChange(index, 'firstName', e.target.value)}
                  className={errors[`authors.${index}.firstName`] ? 'error' : ''}
                  aria-required="true"
                  aria-invalid={errors[`authors.${index}.firstName`] ? true : undefined}
                  placeholder="太郎"
                />
                {errors[`authors.${index}.firstName`] && (
                  <div className="error-message">{errors[`authors.${index}.firstName`]}</div>
                )}
              </div>
              {showReading && (
                <div className="author-field">
                  <label htmlFor={`authors-${index}-reading`}>読み仮名</label>
                  <input
                    id={`authors-${index}-reading`}
                    type="text"
                    value={author.reading}
                    onChange={(e) => handleAuthorChange(index, 'reading', e.target.value)}
                    placeholder="やまだ たろう"
                  />
                </div>
              )}
              {(formData.authors || []).length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-small"
                  onClick={() => removeAuthor(index)}
                >
                  削除
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={addAuthor}
        >
          著者を追加
        </button>
      </div>
    );
  };

  // 翻訳書用の著者フィールドレンダリング関数
  const renderTranslationAuthorsField = (fieldName, label, showReading = true) => {
    const authors = formData[fieldName] || [];
    return (
      <div key={fieldName} className="form-group">
        <label>
          {label} <span className="required-mark">*</span>
        </label>
        {errors[fieldName] && <div className="error-message" role="alert">{errors[fieldName]}</div>}
        {authors.map((author, index) => (
          <div key={index} className="author-input-group">
            <div className="author-fields">
              <div className="author-field">
                <label htmlFor={`${fieldName}-${index}-lastName`}>姓 *</label>
                <input
                  id={`${fieldName}-${index}-lastName`}
                  type="text"
                  value={author.lastName}
                  onChange={(e) => handleAuthorFieldChange(fieldName, index, 'lastName', e.target.value)}
                  className={errors[`${fieldName}.${index}.lastName`] ? 'error' : ''}
                  aria-required="true"
                  aria-invalid={errors[`${fieldName}.${index}.lastName`] ? true : undefined}
                  placeholder="山田"
                />
                {errors[`${fieldName}.${index}.lastName`] && (
                  <div className="error-message">{errors[`${fieldName}.${index}.lastName`]}</div>
                )}
              </div>
              <div className="author-field">
                <label htmlFor={`${fieldName}-${index}-firstName`}>名 *</label>
                <input
                  id={`${fieldName}-${index}-firstName`}
                  type="text"
                  value={author.firstName}
                  onChange={(e) => handleAuthorFieldChange(fieldName, index, 'firstName', e.target.value)}
                  className={errors[`${fieldName}.${index}.firstName`] ? 'error' : ''}
                  aria-required="true"
                  aria-invalid={errors[`${fieldName}.${index}.firstName`] ? true : undefined}
                  placeholder="太郎"
                />
                {errors[`${fieldName}.${index}.firstName`] && (
                  <div className="error-message">{errors[`${fieldName}.${index}.firstName`]}</div>
                )}
              </div>
              {showReading && (
                <div className="author-field">
                  <label htmlFor={`${fieldName}-${index}-reading`}>読み仮名</label>
                  <input
                    id={`${fieldName}-${index}-reading`}
                    type="text"
                    value={author.reading}
                    onChange={(e) => handleAuthorFieldChange(fieldName, index, 'reading', e.target.value)}
                    placeholder="やまだ たろう"
                  />
                </div>
              )}
              {authors.length > 1 && (
                <button
                  type="button"
                  className="btn btn-danger btn-small"
                  onClick={() => removeAuthorField(fieldName, index)}
                >
                  削除
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => addAuthorField(fieldName)}
        >
          {label}を追加
        </button>
      </div>
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reference-type">文献の種類 <span className="required-mark">*</span></label>
          <select
            id="reference-type"
            value={formData.type}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            {Object.entries(REFERENCE_TYPES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          {REFERENCE_TYPE_HINTS[formData.type] && (
            <div className="field-hint">
              <Lightbulb size={16} className="hint-icon" />
              {REFERENCE_TYPE_HINTS[formData.type]}
            </div>
          )}
        </div>

        <APISearch
          type={formData.type}
          onSearchResult={handleIsbnSearchResult}
          onCiniiResult={handleCiniiSearchResult}
        />

        {fields.map(renderField)}

        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            {initialData ? '更新' : '追加'}
          </button>
          {initialData && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              キャンセル
            </button>
          )}
        </div>
      </form>

      {/* モーダルを<form>の外に置く：内側にあると入力欄でEnterを押したときに参考文献フォームが送信されてしまう */}
      <MappingModal
        isOpen={showMappingModal}
        onClose={() => setShowMappingModal(false)}
        apiData={apiData}
        onApply={handleApplyMapping}
        referenceType={formData.type}
      />

      <SearchResultsModal
        isOpen={showResultsModal}
        onClose={() => setShowResultsModal(false)}
        results={ciniiResults}
        onSelect={handleSelectCiniiResult}
      />
    </>
  );
};

export default ReferenceForm;
