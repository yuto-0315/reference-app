// 複数の文献をまとめて書き換えるための処理（画面から切り離して、結果を確かめやすくしている）
import { getReferenceTypeFields } from './formatters';

// 団体名に読み仮名を持つ種類と、読み仮名で並べ替える著者の項目
const ORGANIZATION_TYPES = ['organization-book', 'website'];
const PERSON_FIELDS = ['authors', 'originalAuthors'];

const personName = (person) => `${(person.lastName || '').trim()} ${(person.firstName || '').trim()}`.trim();

// 名前ごとに、出てくる文献の数と登録済みの読み仮名をまとめる
export const collectReadingGroups = (references) => {
  const groups = new Map();
  const addOccurrence = (key, kind, name, reading, referenceId) => {
    if (!groups.has(key)) groups.set(key, { key, kind, name, referenceIds: new Set(), readingCounts: new Map(), missingCount: 0 });
    const group = groups.get(key);
    group.referenceIds.add(referenceId);
    const trimmedReading = (reading || '').trim();
    if (trimmedReading) {
      group.readingCounts.set(trimmedReading, (group.readingCounts.get(trimmedReading) || 0) + 1);
    } else {
      group.missingCount += 1;
    }
  };

  references.forEach(ref => {
    if (ORGANIZATION_TYPES.includes(ref.type) && (ref.organization || '').trim()) {
      const name = ref.organization.trim();
      addOccurrence(`organization:${name}`, 'organization', name, ref.organizationReading, ref.id);
    }
    PERSON_FIELDS.forEach(field => {
      (Array.isArray(ref[field]) ? ref[field] : []).forEach(person => {
        const name = personName(person);
        if (name) addOccurrence(`person:${name}`, 'person', name, person.reading, ref.id);
      });
    });
  });

  return [...groups.values()].map(group => {
    // 多く使われている読み方から並べ、いちばん多いものを入力欄の初期値にする
    const readings = [...group.readingCounts.entries()].sort((a, b) => b[1] - a[1]).map(([reading]) => reading);
    return {
      key: group.key,
      kind: group.kind,
      name: group.name,
      referenceIds: [...group.referenceIds],
      readings,
      isMissing: group.missingCount > 0,
      hasConflict: readings.length > 1
    };
  });
};

// 読み仮名を、同じ名前が出てくるすべての文献にそろえて書き込む
export const applyReadings = (references, readingByKey, updatedAt) => references.map(ref => {
  let changed = false;
  const next = { ...ref };

  const organizationReading = ORGANIZATION_TYPES.includes(ref.type) && readingByKey[`organization:${(ref.organization || '').trim()}`];
  if (organizationReading && ref.organizationReading !== organizationReading) {
    next.organizationReading = organizationReading;
    changed = true;
  }

  PERSON_FIELDS.forEach(field => {
    if (!Array.isArray(ref[field])) return;
    next[field] = ref[field].map(person => {
      const reading = readingByKey[`person:${personName(person)}`];
      if (!reading || person.reading === reading) return person;
      changed = true;
      return { ...person, reading };
    });
  });

  return changed ? { ...next, updatedAt } : ref;
});

// 文献ごとに値が違うのが当たり前の項目は、まとめて同じ値にすると取り返しがつきにくいため対象にしない
const PER_REFERENCE_FIELDS = ['title', 'isbn', 'doi', 'url', 'pages', 'trackNumber', 'catalogNumber'];
const BULK_EDITABLE_INPUT_TYPES = ['text', 'number', 'date'];

// チェックした文献に共通して設定できる項目と、それぞれ何件に当てはまるか
export const getBulkEditableFields = (references) => {
  const fields = new Map();
  references.forEach(ref => {
    getReferenceTypeFields(ref.type)
      .filter(field => BULK_EDITABLE_INPUT_TYPES.includes(field.type) && !PER_REFERENCE_FIELDS.includes(field.key))
      .forEach(field => {
        if (!fields.has(field.key)) fields.set(field.key, { key: field.key, labels: new Set(), inputType: field.type, referenceIds: [] });
        fields.get(field.key).labels.add(field.label);
        fields.get(field.key).referenceIds.push(ref.id);
      });
  });
  // 種類によって呼び名が違う項目（執筆団体／ウェブサイト運営団体名など）は、両方の名前を出す
  return [...fields.values()].map(({ labels, ...field }) => ({ ...field, label: [...labels].join('／') }));
};

export const applyFieldValue = (references, referenceIds, field, value, updatedAt) => {
  const targetIds = new Set(referenceIds);
  const storedValue = field.inputType === 'number' ? Number(value) : value;
  return references.map(ref => (
    targetIds.has(ref.id) && ref[field.key] !== storedValue
      ? { ...ref, [field.key]: storedValue, updatedAt }
      : ref
  ));
};
