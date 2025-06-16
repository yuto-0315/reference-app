import React, { useState, useEffect } from 'react';
import { REFERENCE_TYPES, getReferenceTypeFields } from '../utils/formatters';

const ReferenceForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'japanese-book',
    ...initialData
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({ ...initialData });
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
    setFormData(prev => ({ type: newType }));
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    fields.forEach(field => {
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
      if (!initialData) {
        // 新規追加の場合のみフォームをリセット
        setFormData({ type: 'japanese-book' });
      }
    }
  };

  const renderField = (field) => {
    const { key, label, required, type } = field;
    const value = formData[key] || '';
    const error = errors[key];

    return (
      <div key={key} className="form-group">
        <label>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
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
