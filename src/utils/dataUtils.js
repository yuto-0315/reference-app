// データ整合性とクリーンアップユーティリティ
import { formatReference, migrateReferenceData, REFERENCE_TYPES } from './formatters';

const PERSON_LIST_KEYS = ['authors', 'originalAuthors', 'originalAuthorsEnglish'];
const PERSON_FIELDS = ['lastName', 'firstName', 'reading'];

// 手で編集したJSONなどで、著者が文字列だったり項目がオブジェクトだったりしても画面が落ちないよう、
// 画面が想定する形（著者は姓・名・読みの文字列を持つオブジェクトの配列、その他は文字か数）にそろえる
const toPerson = (person) => {
  if (typeof person === 'string') return { lastName: person, firstName: '', reading: '' };
  if (!person || typeof person !== 'object') return null;
  return Object.fromEntries(PERSON_FIELDS.map(field => [
    field,
    typeof person[field] === 'string' || typeof person[field] === 'number' ? String(person[field]) : ''
  ]));
};

export const sanitizeReference = (reference) => {
  if (!reference || typeof reference !== 'object' || Array.isArray(reference)) return null;
  const sanitized = {};
  Object.entries(reference).forEach(([key, value]) => {
    if (PERSON_LIST_KEYS.includes(key)) {
      sanitized[key] = (Array.isArray(value) ? value : [value]).map(toPerson).filter(Boolean);
    } else if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
    }
    // オブジェクト・配列など、どの入力欄にも当てはまらない値は持ち込まない
  });
  if (sanitized.id !== undefined) sanitized.id = String(sanitized.id);
  return sanitized;
};

export const isKnownReferenceType = (type) => Object.prototype.hasOwnProperty.call(REFERENCE_TYPES, type);

/**
 * 表示時に毎回計算し直す項目（a,b,cのサフィックス）を取り除く
 * 編集画面経由で保存されると、文献の増減後も古いサフィックスが残ってしまうため
 * @param {Object} reference - 参考文献
 * @returns {Object} 計算項目を除いた参考文献
 */
export const stripComputedFields = (reference) => {
  const { yearSuffix, displayYear, ...rest } = reference;
  return rest;
};

/**
 * 配列から重複を除去する（IDベース）
 * @param {Array} references - 参考文献の配列
 * @returns {Array} 重複を除去した配列
 */
export const removeDuplicates = (references) => {
  if (!Array.isArray(references)) {
    console.warn('removeDuplicates: 入力が配列ではありません', references);
    return [];
  }

  const seen = new Set();
  const uniqueReferences = [];

  references.forEach((ref) => {
    if (!ref || typeof ref !== 'object') {
      console.warn('removeDuplicates: 不正なデータを検出しました', ref);
      return;
    }

    if (!ref.id) {
      console.warn('removeDuplicates: IDが存在しないデータを検出しました', ref);
      return;
    }

    if (!seen.has(ref.id)) {
      seen.add(ref.id);
      uniqueReferences.push(ref);
    } else {
      console.log(`重複データを除去しました: ${ref.id} - ${ref.title || '不明なタイトル'}`);
    }
  });

  return uniqueReferences;
};

/**
 * データの整合性をチェックして修復する
 * @param {Array} references - 参考文献の配列
 * @returns {Object} { cleaned: Array, stats: Object }
 */
export const validateAndCleanData = (references) => {
  const stats = {
    originalCount: 0,
    duplicatesRemoved: 0,
    invalidDataRemoved: 0,
    finalCount: 0
  };

  if (!Array.isArray(references)) {
    console.warn('validateAndCleanData: 入力が配列ではありません');
    return { cleaned: [], stats };
  }

  stats.originalCount = references.length;

  // 1. 基本的な不正データを除去（形をそろえたうえで、IDと文献の種類があるものだけ残す）
  const validReferences = references.map(sanitizeReference).filter((ref) => {
    if (!ref || !ref.id || !isKnownReferenceType(ref.type)) {
      stats.invalidDataRemoved++;
      return false;
    }
    return true;
  });

  // 2. 重複を除去
  const beforeDuplicateRemoval = validReferences.length;
  const uniqueReferences = removeDuplicates(validReferences);
  stats.duplicatesRemoved = beforeDuplicateRemoval - uniqueReferences.length;

  // 3. 必須フィールドの検証と修復
  const cleanedReferences = uniqueReferences.map((ref) => {
    const cleaned = stripComputedFields(ref);

    // createdAtがない場合は追加
    if (!cleaned.createdAt) {
      cleaned.createdAt = new Date().toISOString();
    }

    // updatedAtがない場合は追加
    if (!cleaned.updatedAt) {
      cleaned.updatedAt = cleaned.createdAt;
    }

    // 年が文字列の場合は数値に変換
    if (cleaned.year && typeof cleaned.year === 'string') {
      const yearNum = parseInt(cleaned.year, 10);
      if (!isNaN(yearNum)) {
        cleaned.year = yearNum;
      }
    }

    return cleaned;
  });

  stats.finalCount = cleanedReferences.length;

  return { cleaned: cleanedReferences, stats };
};

/**
 * 参考文献が既に存在するかチェック
 * @param {Array} references - 既存の参考文献配列
 * @param {Object} newReference - 新しい参考文献
 * @returns {boolean} 既に存在する場合はtrue
 */
export const findDuplicate = (references, newReference) => {
  if (!Array.isArray(references) || !newReference) {
    return null;
  }

  // 内容ベースのチェック：参考文献一覧に出力される文字列が同じなら同じ文献とみなす
  // （別のIDで登録された同じ文献も見つけられるように）
  const toComparableText = (ref) => formatReference(migrateReferenceData(stripComputedFields(ref)));
  const newReferenceText = toComparableText(newReference);

  return references.find(ref =>
    (newReference.id && ref.id === newReference.id) ||
    toComparableText(ref) === newReferenceText
  ) || null;
};

export const isDuplicate = (references, newReference) => Boolean(findDuplicate(references, newReference));

// 読めなかった保存データを残しておく場所。空のデータで上書きして、文献がすべて消えてしまうのを防ぐ
export const CORRUPT_BACKUP_SUFFIX = ':unreadable-backup';

/**
 * ローカルストレージからデータを安全に読み込む
 * 読めなかったときは元の文字列を別の場所に退避し、problem で知らせる（黙って空にしない）
 * @param {string} storageKey - ストレージキー
 * @returns {{ references: Array, problem: null | 'unreadable', invalidCount: number }}
 */
export const readStoredReferences = (storageKey) => {
  let savedData = null;
  try {
    savedData = localStorage.getItem(storageKey);
  } catch (error) {
    // 保存データの読み取り自体が禁止されている（プライベートモードの制限など）
    return { references: [], problem: 'unavailable', invalidCount: 0 };
  }
  if (!savedData) return { references: [], problem: null, invalidCount: 0 };

  let parsedData;
  try {
    parsedData = JSON.parse(savedData);
  } catch (error) {
    parsedData = null;
  }
  const keepOriginal = () => {
    try {
      localStorage.setItem(`${storageKey}${CORRUPT_BACKUP_SUFFIX}`, savedData);
    } catch (error) {
      // 退避できなくても、読めなかったことは知らせる
    }
  };
  if (!Array.isArray(parsedData)) {
    keepOriginal();
    return { references: [], problem: 'unreadable', invalidCount: 0 };
  }

  const { cleaned, stats } = validateAndCleanData(parsedData);
  // 読めない文献は一覧から外れるため、元の内容を残しておく
  if (stats.invalidDataRemoved > 0) keepOriginal();
  return { references: cleaned, problem: null, invalidCount: stats.invalidDataRemoved };
};

export const loadFromStorage = (storageKey) => readStoredReferences(storageKey).references;

/**
 * ローカルストレージに安全に保存する
 * @param {string} storageKey - ストレージキー
 * @param {Array} references - 参考文献配列
 * @returns {boolean} 保存できたか（容量不足などで失敗したら false）
 */
export const saveToStorage = (storageKey, references) => {
  try {
    const { cleaned } = validateAndCleanData(references);
    localStorage.setItem(storageKey, JSON.stringify(cleaned));
    return true;
  } catch (error) {
    return false;
  }
};

// 参考文献一覧に出る文字列が同じ文献（同じ文献を2回登録したもの）を、先に登録したものだけ残して取り除く
export const removeContentDuplicates = (references) => {
  const seenTexts = new Set();
  return references.filter(ref => {
    const text = formatReference(migrateReferenceData(stripComputedFields(ref)));
    if (seenTexts.has(text)) return false;
    seenTexts.add(text);
    return true;
  });
};

const timeOf = (reference) => Date.parse(reference.updatedAt || reference.createdAt || '') || 0;

/**
 * JSONから取り込む内容を決める。
 * - 同じIDの文献は、取り込むほうが新しく更新されていれば置き換える（別のPCで直した内容を持ち帰れるように）
 * - 新しいIDの文献は、同じ内容の文献がなければ追加する
 * @returns {{ next: Array, added: number, updated: number, unchanged: number, duplicates: number, invalid: number }}
 */
export const planImport = (existingReferences, importedData, createId) => {
  const result = { next: [...existingReferences], added: 0, updated: 0, unchanged: 0, duplicates: 0, invalid: 0 };
  // 同じファイルの中で同じIDが使われていても、別の文献として扱う（後ろのものが消えないように）
  const idsInFile = new Set();
  const withUniqueIds = importedData.map(ref => {
    if (!ref || typeof ref !== 'object') return ref;
    const id = ref.id ? String(ref.id) : '';
    const uniqueId = id && !idsInFile.has(id) ? id : createId();
    idsInFile.add(uniqueId);
    return { ...ref, id: uniqueId };
  });
  const { cleaned, stats } = validateAndCleanData(withUniqueIds);
  result.invalid = stats.invalidDataRemoved;

  cleaned.forEach(ref => {
    const existingIndex = result.next.findIndex(existing => existing.id === ref.id);
    if (existingIndex !== -1) {
      if (timeOf(ref) > timeOf(result.next[existingIndex])) {
        result.next[existingIndex] = ref;
        result.updated += 1;
      } else {
        result.unchanged += 1;
      }
      return;
    }
    if (isDuplicate(result.next, ref)) {
      result.duplicates += 1;
      return;
    }
    result.next.push({ ...ref, importedAt: new Date().toISOString() });
    result.added += 1;
  });
  return result;
};

/**
 * まとめて変更した内容だけを元に戻す関数を作る。
 * 変更前の一覧を丸ごと戻すと、そのあと別のタブや別の操作で加えた変更まで消えてしまうため、
 * 変更した文献だけを変更前の状態に戻し、追加した文献だけを取り除く
 */
export const createUndo = (previousReferences, nextReferences) => {
  const previousById = new Map(previousReferences.map((ref, index) => [ref.id, { ref, index }]));
  const nextById = new Map(nextReferences.map(ref => [ref.id, ref]));
  const addedIds = new Set(nextReferences.filter(ref => !previousById.has(ref.id)).map(ref => ref.id));
  const changed = previousReferences.filter(ref => nextById.get(ref.id) !== ref);

  return (currentReferences) => {
    const changedById = new Map(changed.map(ref => [ref.id, ref]));
    const restored = currentReferences
      .filter(ref => !addedIds.has(ref.id))
      .map(ref => changedById.get(ref.id) || ref);
    // 削除した文献は、元の位置に戻す
    changed
      .filter(ref => !restored.some(current => current.id === ref.id))
      .sort((a, b) => previousById.get(a.id).index - previousById.get(b.id).index)
      .forEach(ref => restored.splice(Math.min(previousById.get(ref.id).index, restored.length), 0, ref));
    return restored;
  };
};
