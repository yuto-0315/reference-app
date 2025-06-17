import React, { useState, useEffect } from 'react';
import { REFERENCE_TYPES, REFERENCE_TYPE_HINTS, getReferenceTypeFields } from '../utils/formatters';
import InfoTooltip from './InfoTooltip';

const ReferenceForm = ({ onSubmit, initialData, onCancel }) => {
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({ 
        ...initialData,
        authors: initialData.authors && initialData.authors.length > 0 
          ? initialData.authors 
          : [{ lastName: '', firstName: '', reading: '' }]
      });
    }
  }, [initialData]);

  const fields = getReferenceTypeFields(formData.type);

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  const handleTypeChange = (newType) => {
    // 新しいタイプに著者フィールドがあるかチェック
    const newFields = getReferenceTypeFields(newType);
    const hasAuthorsField = newFields.some(field => field.key === 'authors');
    
    const newFormData = { 
      type: newType
    };
    
    // 著者フィールドがある場合のみ著者を初期化
    if (hasAuthorsField) {
      newFormData.authors = [{ lastName: '', firstName: '', reading: '' }];
    }

    // 翻訳書の場合は原著者と訳者フィールドを初期化
    if (newType === 'translation') {
      newFormData.originalAuthors = [{ lastName: '', firstName: '', reading: '' }];
      newFormData.originalAuthorsEnglish = [{ lastName: '', firstName: '', reading: '' }];
      newFormData.translators = [{ lastName: '', firstName: '', reading: '' }];
    }
    
    setFormData(prev => ({ ...newFormData }));
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
      authors: [...prev.authors, { lastName: '', firstName: '', reading: '' }]
    }));
  };

  const addAuthorField = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), { lastName: '', firstName: '', reading: '' }]
    }));
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
    
    // 著者フィールドがある文献タイプの場合のみ著者の検証を行う
    const hasAuthorsField = fields.some(field => field.key === 'authors');
    if (hasAuthorsField) {
      formData.authors.forEach((author, index) => {
        if (!author.lastName) {
          newErrors[`authors.${index}.lastName`] = '姓は必須項目です';
        }
        if (!author.firstName) {
          newErrors[`authors.${index}.firstName`] = '名は必須項目です';
        }
      });
    }

    // 翻訳書の場合は原著者と訳者の検証を行う
    if (formData.type === 'translation') {
      // 原著者（日本語）の検証
      if (formData.originalAuthors) {
        formData.originalAuthors.forEach((author, index) => {
          if (!author.lastName) {
            newErrors[`originalAuthors.${index}.lastName`] = '原著者（日本語）の姓は必須項目です';
          }
          if (!author.firstName) {
            newErrors[`originalAuthors.${index}.firstName`] = '原著者（日本語）の名は必須項目です';
          }
        });
      }

      // 原著者（英語）の検証
      if (formData.originalAuthorsEnglish) {
        formData.originalAuthorsEnglish.forEach((author, index) => {
          if (!author.lastName) {
            newErrors[`originalAuthorsEnglish.${index}.lastName`] = '原著者（原語）の姓は必須項目です';
          }
          if (!author.firstName) {
            newErrors[`originalAuthorsEnglish.${index}.firstName`] = '原著者（原語）の名は必須項目です';
          }
        });
      }

      // 訳者の検証
      if (formData.translators) {
        formData.translators.forEach((translator, index) => {
          if (!translator.lastName) {
            newErrors[`translators.${index}.lastName`] = '訳者の姓は必須項目です';
          }
          if (!translator.firstName) {
            newErrors[`translators.${index}.firstName`] = '訳者の名は必須項目です';
          }
        });
      }
    }
    
    // その他のフィールドの検証
    fields.forEach(field => {
      if (field.key === 'authors') return; // 著者は上で処理済み
      
      if (field.required && !formData[field.key]) {
        newErrors[field.key] = `${field.label}は必須項目です`;
      }
      // 特別な検証: メールアドレス形式のURL
      if (field.type === 'url' && formData[field.key] && 
          !formData[field.key].match(/^https?:\/\/.+/)) {
        newErrors[field.key] = '有効なURLを入力してください（http://またはhttps://で始まる）';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      // 新規追加・編集問わずフォームをリセット
      const resetData = { type: 'japanese-book' };
      // 日本語書籍は著者フィールドがあるので著者を初期化
      resetData.authors = [{ lastName: '', firstName: '', reading: '' }];
      
      setFormData(resetData);
      setErrors({});
    }
  };

  const renderField = (field) => {
    const { key, label, required, type, description, example } = field;
    
    if (key === 'authors') {
      return renderAuthorsField();
    }

    // 翻訳書の特別なフィールド処理
    if (type === 'translation-authors') {
      return renderTranslationAuthorsField(key, label);
    }
    
    const value = formData[key] || '';
    const error = errors[key];

    return (
      <div key={key} className="form-group">
        <label>
          <span className="label-text">
            {label}
            {required && <span style={{ color: 'red' }}> *</span>}
            <InfoTooltip description={description} example={example} />
          </span>
        </label>
        {type === 'textarea' ? (
          <textarea
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className={error ? 'error' : ''}
            rows={3}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => handleChange(key, e.target.value)}
            className={error ? 'error' : ''}
            placeholder={field.placeholder || ''}
          />
        )}
        {error && <div className="error-message">{error}</div>}
      </div>
    );
  };

  const renderAuthorsField = () => {
    return (
      <div key="authors" className="form-group">
        <label>
          著者 <span style={{ color: 'red' }}>*</span>
        </label>
        {formData.authors.map((author, index) => (
          <div key={index} className="author-input-group">
            <div className="author-fields">
              <div className="author-field">
                <label>姓 *</label>
                <input
                  type="text"
                  value={author.lastName}
                  onChange={(e) => handleAuthorChange(index, 'lastName', e.target.value)}
                  className={errors[`authors.${index}.lastName`] ? 'error' : ''}
                  placeholder="山田"
                />
                {errors[`authors.${index}.lastName`] && (
                  <div className="error-message">{errors[`authors.${index}.lastName`]}</div>
                )}
              </div>
              <div className="author-field">
                <label>名 *</label>
                <input
                  type="text"
                  value={author.firstName}
                  onChange={(e) => handleAuthorChange(index, 'firstName', e.target.value)}
                  className={errors[`authors.${index}.firstName`] ? 'error' : ''}
                  placeholder="太郎"
                />
                {errors[`authors.${index}.firstName`] && (
                  <div className="error-message">{errors[`authors.${index}.firstName`]}</div>
                )}
              </div>
              <div className="author-field">
                <label>読み仮名</label>
                <input
                  type="text"
                  value={author.reading}
                  onChange={(e) => handleAuthorChange(index, 'reading', e.target.value)}
                  placeholder="やまだ たろう"
                />
              </div>
              {formData.authors.length > 1 && (
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
  const renderTranslationAuthorsField = (fieldName, label) => {
    const authors = formData[fieldName] || [];
    return (
      <div key={fieldName} className="form-group">
        <label>
          {label} <span style={{ color: 'red' }}>*</span>
        </label>
        {authors.map((author, index) => (
          <div key={index} className="author-input-group">
            <div className="author-fields">
              <div className="author-field">
                <label>姓 *</label>
                <input
                  type="text"
                  value={author.lastName}
                  onChange={(e) => handleAuthorFieldChange(fieldName, index, 'lastName', e.target.value)}
                  className={errors[`${fieldName}.${index}.lastName`] ? 'error' : ''}
                  placeholder="山田"
                />
                {errors[`${fieldName}.${index}.lastName`] && (
                  <div className="error-message">{errors[`${fieldName}.${index}.lastName`]}</div>
                )}
              </div>
              <div className="author-field">
                <label>名 *</label>
                <input
                  type="text"
                  value={author.firstName}
                  onChange={(e) => handleAuthorFieldChange(fieldName, index, 'firstName', e.target.value)}
                  className={errors[`${fieldName}.${index}.firstName`] ? 'error' : ''}
                  placeholder="太郎"
                />
                {errors[`${fieldName}.${index}.firstName`] && (
                  <div className="error-message">{errors[`${fieldName}.${index}.firstName`]}</div>
                )}
              </div>
              <div className="author-field">
                <label>読み仮名</label>
                <input
                  type="text"
                  value={author.reading}
                  onChange={(e) => handleAuthorFieldChange(fieldName, index, 'reading', e.target.value)}
                  placeholder="やまだ たろう"
                />
              </div>
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
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>文献の種類 <span style={{ color: 'red' }}>*</span></label>
        <select
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
            <span className="hint-icon">💡</span>
            {REFERENCE_TYPE_HINTS[formData.type]}
          </div>
        )}
      </div>

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
  );
};

export default ReferenceForm;
