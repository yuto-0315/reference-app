// データ整合性とクリーンアップユーティリティ

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

  // 1. 基本的な不正データを除去
  const validReferences = references.filter((ref) => {
    if (!ref || typeof ref !== 'object') {
      stats.invalidDataRemoved++;
      return false;
    }
    if (!ref.id || !ref.type) {
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
    const cleaned = { ...ref };

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
export const isDuplicate = (references, newReference) => {
  if (!Array.isArray(references) || !newReference) {
    return false;
  }

  // IDベースでのチェック
  if (newReference.id) {
    return references.some(ref => ref.id === newReference.id);
  }

  // 内容ベースでのチェック（IDがない場合）
  return references.some(ref => 
    ref.authorLastName === newReference.authorLastName &&
    ref.authorFirstName === newReference.authorFirstName &&
    ref.title === newReference.title &&
    ref.year === newReference.year
  );
};

/**
 * ローカルストレージからデータを安全に読み込む
 * @param {string} storageKey - ストレージキー
 * @returns {Array} クリーンアップされた参考文献配列
 */
export const loadFromStorage = (storageKey) => {
  try {
    const savedData = localStorage.getItem(storageKey);
    if (!savedData) {
      return [];
    }

    const parsedData = JSON.parse(savedData);
    const { cleaned, stats } = validateAndCleanData(parsedData);

    if (stats.duplicatesRemoved > 0 || stats.invalidDataRemoved > 0) {
      console.log('ローカルストレージのデータをクリーンアップしました:', stats);
      // クリーンアップされたデータを保存
      localStorage.setItem(storageKey, JSON.stringify(cleaned));
    }

    return cleaned;
  } catch (error) {
    console.error('ローカルストレージからの読み込みエラー:', error);
    return [];
  }
};

/**
 * ローカルストレージに安全に保存する
 * @param {string} storageKey - ストレージキー
 * @param {Array} references - 参考文献配列
 */
export const saveToStorage = (storageKey, references) => {
  try {
    const { cleaned } = validateAndCleanData(references);
    localStorage.setItem(storageKey, JSON.stringify(cleaned));
  } catch (error) {
    console.error('ローカルストレージへの保存エラー:', error);
  }
};
