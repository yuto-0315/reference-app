// 文献種別の定義
export const REFERENCE_TYPES = {
  'japanese-book': '日本語書籍',
  'japanese-journal': '日本語雑誌論文',
  'japanese-chapter': '日本語書籍所収論文',
  'organization-book': '団体出版本',
  'english-book': '英語書籍',
  'english-journal': '英語雑誌論文',
  'english-chapter': '英語書籍所収論文',
  'translation': '翻訳書',
  'dictionary': '辞事典項目',
  'score-domestic': '楽譜（国内）',
  'score-foreign': '楽譜（海外）',
  'website': 'インターネット資料',
  'audiovisual': '視聴覚資料'
};

// 文献種別のヒント（該当する文献の例）
export const REFERENCE_TYPE_HINTS = {
  'japanese-book': '一般的な書籍・専門書・教材など',
  'japanese-journal': '学会誌・研究紀要・専門雑誌の論文など',
  'japanese-chapter': '論文集・編著書の章・記念論文集の論文など',
  'organization-book': '教科書・指導要領・白書・報告書など',
  'english-book': '洋書・海外の専門書・原書など',
  'english-journal': '海外学術誌・国際誌の論文など',
  'english-chapter': '海外の論文集・編著書の章など',
  'translation': '翻訳された書籍・海外文献の日本語版など',
  'dictionary': '辞書・事典・用語集の項目など',
  'score-domestic': '国内出版の楽譜・曲集など',
  'score-foreign': '海外出版の楽譜・原版楽譜など',
  'website': 'ウェブサイト・オンライン資料・デジタルコンテンツなど',
  'audiovisual': 'CD・DVD・録音資料・映像資料など'
};

// 各文献種別に必要なフィールド
export const getReferenceTypeFields = (type) => {
  const fieldConfigs = {
    'japanese-book': [
      {
        key: 'authors', label: '著者', required: true, type: 'authors',
        description: '書籍の著者名を入力してください。複数いる場合は奥付どおりの順に設定してください。',
      },
      {
        key: 'title', label: '書名', required: true, type: 'text',
        description: '書籍の正式なタイトルを入力してください。',
        example: 'はじめての世界音楽―諸民族の伝統音楽からポップスまで'
      },
      {
        key: 'publisher', label: '出版社', required: true, type: 'text',
        description: '書籍を出版した出版社名を入力してください。',
        example: '音楽之友社'
      },
      {
        key: 'year', label: '出版年', required: true, type: 'number',
        description: '書籍が出版された年を西暦で入力してください。',
        example: '2023'
      },
      { key: 'editors', label: '編者名', required: false, type: 'text' },
      { key: 'translators', label: '訳者名', required: false, type: 'text' },
      { key: 'isbn', label: 'ISBN', required: false, type: 'text' },
      {
        key: 'doi', label: 'DOI', required: false, type: 'text', placeholder: '10.1234/example',
        description: 'デジタルオブジェクト識別子（DOI）がある場合は入力してください。',
        example: '10.1234/example.doi'
      },
      { key: 'url', label: 'URL', required: false, type: 'url' }
    ],

    'japanese-journal': [
      { key: 'authors', label: '執筆者', required: true, type: 'authors' },
      {
        key: 'title', label: '論文名', required: true, type: 'text',
        description: '論文の正式なタイトルを入力してください。',
        example: '昭和初期の東京市三河台尋常小学校における音楽教育の実践'
      },
      {
        key: 'editorialOrganization', label: '雑誌編集団体', required: false, type: 'text', placeholder: '音楽教育史学会',
        description: '雑誌を編集・発行している学会や団体名を入力してください。',
        example: '音楽教育史学会'
      },
      {
        key: 'journalName', label: '雑誌名', required: true, type: 'text',
        description: '論文が掲載された雑誌の正式名称を入力してください。',
        example: '音楽教育史研究'
      },
      { key: 'volume', label: '巻', required: false, type: 'text' },
      { key: 'issue', label: '号', required: false, type: 'text' },
      { key: 'year', label: '出版年', required: true, type: 'number' },
      {
        key: 'pages', label: '掲載ページ', required: true, type: 'text',
        description: '論文が掲載されているページ範囲を入力してください。',
        example: '45-58'
      },
      {
        key: 'doi', label: 'DOI', required: false, type: 'text', placeholder: '10.1234/example',
        description: 'デジタルオブジェクト識別子（DOI）がある場合は入力してください。',
        example: '10.1234/example.doi'
      },
      { key: 'url', label: 'URL', required: false, type: 'url' }
    ],

    'japanese-chapter': [
      {
        key: 'authors', label: '執筆者', required: true, type: 'authors',
        description: '書籍の章を執筆した著者名を入力してください。複数いる場合は奥付どおりの順に設定してください。'
      },
      {
        key: 'title', label: '論文名', required: true, type: 'text',
        description: '書籍の正式なタイトルを入力してください。',
        example: '人民中国の光と影'
      },
      { key: 'editors', label: '編者名', required: true, type: 'text' },
      { key: 'bookTitle', label: '書名', required: true, type: 'text' },
      {
        key: 'publisher', label: '出版社', required: true, type: 'text',
        description: '出版社名を記載してください。',
        example: '山川出版社'
      },
      { key: 'year', label: '出版年', required: true, type: 'number' },
      {
        key: 'pages', label: '掲載ページ', required: true, type: 'text',
        description: '論文が掲載されているページ範囲を入力してください。',
        example: '45-58'
      },
      {
        key: 'doi', label: 'DOI', required: false, type: 'text', placeholder: '10.1234/example',
        description: 'デジタルオブジェクト識別子（DOI）がある場合は入力してください。',
        example: '10.1234/example.doi'
      },
      { key: 'url', label: 'URL', required: false, type: 'url' }
    ],

    'organization-book': [
      {
        key: 'organization', label: '執筆団体', required: true, type: 'text',
        description: '書籍を執筆・発行した団体名を入力してください。',
        example: '文部科学省'
      },
      {
        key: 'organizationReading', label: '執筆団体（読み仮名）', required: false, type: 'text',
        description: '執筆団体の読み仮名を入力してください（並べ替えに使用します）。',
        example: 'もんぶかがくしょう'
      },
      {
        key: 'title', label: '書名', required: true, type: 'text',
        description: '書籍の正式なタイトルを入力してください。',
        example: '小学校学習指導要領音楽解説編'
      },
      {
        key: 'year', label: '出版年', required: true, type: 'number',
        description: '書籍が出版された年を西暦で入力してください。',
        example: '2017'
      },
      {
        key: 'doi', label: 'DOI', required: false, type: 'text', placeholder: '10.1234/example',
        description: 'デジタルオブジェクト識別子（DOI）がある場合は入力してください。',
        example: '10.1234/example.doi'
      },
      { key: 'url', label: 'URL', required: false, type: 'url' }
    ],

    'english-book': [
      { key: 'authors', label: 'Authors', required: true, type: 'authors' },
      { key: 'title', label: 'Book Title', required: true, type: 'text' },
      { key: 'publisherLocation', label: 'Publisher Location', required: true, type: 'text' },
      { key: 'publisher', label: 'Publisher', required: true, type: 'text' },
      { key: 'year', label: 'Publication Year', required: true, type: 'number' },
      { key: 'isbn', label: 'ISBN', required: false, type: 'text' },
      {
        key: 'doi', label: 'DOI', required: false, type: 'text', placeholder: '10.1234/example',
        description: 'デジタルオブジェクト識別子（DOI）がある場合は入力してください。',
        example: '10.1234/example.doi'
      },
      { key: 'url', label: 'URL', required: false, type: 'url' }
    ],

    'english-journal': [
      { key: 'authors', label: 'Authors', required: true, type: 'authors' },
      { key: 'title', label: 'Article Title', required: true, type: 'text' },
      { key: 'journalName', label: 'Journal Name', required: true, type: 'text' },
      { key: 'volume', label: 'Volume', required: false, type: 'text' },
      { key: 'issue', label: 'Issue', required: false, type: 'text' },
      { key: 'year', label: 'Publication Year', required: true, type: 'number' },
      { key: 'pages', label: 'Pages', required: true, type: 'text' },
      {
        key: 'doi', label: 'DOI', required: false, type: 'text', placeholder: '10.1234/example',
        description: 'デジタルオブジェクト識別子（DOI）がある場合は入力してください。',
        example: '10.1234/example.doi'
      },
      { key: 'url', label: 'URL', required: false, type: 'url' }
    ],

    'english-chapter': [
      { key: 'authors', label: 'Authors', required: true, type: 'authors' },
      { key: 'title', label: 'Chapter Title', required: true, type: 'text' },
      { key: 'bookTitle', label: 'Book Title', required: true, type: 'text' },
      { key: 'publisherLocation', label: 'Publisher Location', required: true, type: 'text' },
      { key: 'publisher', label: 'Publisher', required: true, type: 'text' },
      { key: 'year', label: 'Publication Year', required: true, type: 'number' },
      { key: 'pages', label: 'Pages', required: true, type: 'text' },
      {
        key: 'doi', label: 'DOI', required: false, type: 'text', placeholder: '10.1234/example',
        description: 'デジタルオブジェクト識別子（DOI）がある場合は入力してください。',
        example: '10.1234/example.doi'
      },
      { key: 'url', label: 'URL', required: false, type: 'url' }
    ],

    'translation': [
      {
        key: 'originalAuthors', label: '原著者（日本語表記）', required: true, type: 'translation-authors',
        description: '原書の著者名を日本語（カタカナ）で入力してください。複数いる場合は奥付どおりの順に設定してください。'
      },
      {
        key: 'originalAuthorsEnglish', label: '原著者（原語表記）', required: true, type: 'translation-authors',
        description: '原書の著者名を原語（英語など）で入力してください。複数いる場合は奥付どおりの順に設定してください。'
      },
      {
        key: 'translators', label: '訳者', required: true, type: 'translation-authors',
        description: '翻訳者名を入力してください。複数いる場合は奥付どおりの順に設定してください。'
      },
      {
        key: 'title', label: '翻訳書名', required: true, type: 'text',
        description: '翻訳書の正式なタイトルを入力してください。',
        example: '西洋音楽史(上)'
      },
      {
        key: 'publisher', label: '出版社', required: true, type: 'text',
        description: '翻訳書を出版した出版社名を入力してください。',
        example: '音楽之友社'
      },
      {
        key: 'year', label: '翻訳書出版年', required: true, type: 'number',
        description: '翻訳書が出版された年を西暦で入力してください。',
        example: '1969'
      },
      {
        key: 'originalTitle', label: '原書名', required: true, type: 'text',
        description: '原書の正式なタイトルを入力してください。',
        example: 'A History of Western Music'
      },
      {
        key: 'originalPublisherLocation', label: '原書出版地', required: true, type: 'text',
        description: '原書の出版地を入力してください。',
        example: 'New York'
      },
      {
        key: 'originalPublisher', label: '原書出版社', required: true, type: 'text',
        description: '原書の出版社名を入力してください。',
        example: 'W. W. Norton & Company'
      },
      {
        key: 'originalYear', label: '原書出版年', required: true, type: 'number',
        description: '原書が出版された年を西暦で入力してください。',
        example: '1960'
      }
    ],

    'dictionary': [
      { key: 'authors', label: '項目執筆者', required: true, type: 'authors' },
      { key: 'title', label: '項目名', required: true, type: 'text' },
      { key: 'dictionaryTitle', label: '辞事典名', required: true, type: 'text' },
      { key: 'volume', label: '巻号', required: false, type: 'text' },
      { key: 'publisher', label: '発行社', required: true, type: 'text' },
      { key: 'year', label: '出版年', required: true, type: 'number' },
      { key: 'pages', label: '掲載ページ', required: true, type: 'text' }
    ],

    'score-domestic': [
      { key: 'composer', label: '作曲者名', required: true, type: 'text' },
      { key: 'title', label: '曲名', required: true, type: 'text' },
      { key: 'collectionTitle', label: '曲集名', required: false, type: 'text' },
      { key: 'editor', label: '校訂者', required: false, type: 'text' },
      { key: 'publisherLocation', label: '出版地', required: true, type: 'text' },
      { key: 'publisher', label: '出版社', required: true, type: 'text' },
      { key: 'year', label: '出版年', required: true, type: 'number' }
    ],

    'score-foreign': [
      { key: 'composer', label: '作曲者名', required: true, type: 'text' },
      { key: 'title', label: '曲名', required: true, type: 'text' },
      { key: 'collectionTitle', label: '曲集名', required: false, type: 'text' },
      { key: 'editor', label: '校訂者', required: false, type: 'text' },
      { key: 'catalogNumber', label: '出版番号', required: true, type: 'text' },
      { key: 'publisherLocation', label: '出版地', required: true, type: 'text' },
      { key: 'publisher', label: '出版社', required: true, type: 'text' },
      { key: 'year', label: '出版年', required: true, type: 'number' }
    ],

    'website': [
      { key: 'organization', label: 'ウェブサイト運営団体名', required: true, type: 'text', description: 'Webサイトの運営団体や著者名を入力してください。（「webサイト」は自動で付きます）', example: '文部科学省' },
      { key: 'organizationReading', label: '運営団体（読み仮名）', required: false, type: 'text', description: '運営団体の読み仮名を入力してください（並べ替えに使用します）。', example: 'もんぶかがくしょう' },
      { key: 'title', label: 'ページタイトル', required: true, type: 'text', description: 'Webページの正式なタイトルを入力してください。', example: '学習指導要領「生きる力」' },
      { key: 'url', label: 'URL', required: true, type: 'url', description: 'WebページのURLを入力してください。', example: 'https://www.mext.go.jp/a_menu/shotou/new-cs/index.htm' },
      { key: 'accessDate', label: '閲覧年月日', required: true, type: 'date', description: '実際にアクセスした日付を入力してください。', example: '2020-02-11' }
    ],

    'audiovisual': [
      { key: 'composer', label: '作曲者名', required: true, type: 'text' },
      { key: 'title', label: '曲名', required: true, type: 'text' },
      { key: 'performers', label: '演奏者・演奏団体名', required: true, type: 'text' },
      { key: 'label', label: 'レーベル名', required: true, type: 'text' },
      { key: 'mediaType', label: '資料種別', required: true, type: 'text' },
      { key: 'catalogNumber', label: '発売番号', required: true, type: 'text' },
      { key: 'trackNumber', label: 'トラック番号', required: false, type: 'text' },
      { key: 'recordingYear', label: '録音年', required: false, type: 'number' },
      { key: 'releaseYear', label: '発売年', required: true, type: 'number' }
    ]
  };

  return fieldConfigs[type] || fieldConfigs['japanese-book'];
};

// 著者名をフォーマットするユーティリティ関数
export const formatAuthors = (authors, isJapanese = true, forCitation = false) => {
  if (!authors || authors.length === 0) return '';

  if (forCitation) {
    // 引用形式では筆頭著者の姓のみ
    const firstAuthor = authors[0];
    return firstAuthor.lastName || '';
  }

  // 3名以下：全員を記載し、中黒でつなぐ
  // 4名以上：筆頭著者のみ記載し、「ほか」を付加
  if (authors.length < 4) {
    if (isJapanese) {
      return authors.map(author =>
        `${author.lastName}${author.firstName}`
      ).join('・');
    } else {
      return authors.map((author, index) =>
        index === 0
          ? `${author.lastName}, ${author.firstName}`
          : `${author.firstName} ${author.lastName}`
      ).join(', ');
    }
  } else {
    const firstAuthor = authors[0];
    if (isJapanese) {
      return `${firstAuthor.lastName}${firstAuthor.firstName}ほか`;
    } else {
      return `${firstAuthor.lastName}, ${firstAuthor.firstName}, et al.`;
    }
  }
};

// 出版年（視聴覚資料は発売年を出版年として扱う）
export const getPublicationYear = (reference) =>
  reference.type === 'audiovisual' ? reference.releaseYear : reference.year;

// 編集時に著者欄のない文献種別へ空の著者が保存されている場合があるため、名前のある著者だけを見る
const getNamedAuthors = (reference) =>
  (reference.authors || []).filter(author => author.lastName || author.firstName);

// 同一著者・同年の判定（a,b,c）に使う著者キー。既存の論文の表記がずれないよう、筆頭著者の姓で判定する
const getSuffixGroupAuthorKey = (reference) => {
  if (reference.type === 'website' || reference.type === 'organization-book') {
    return reference.organization || '';
  }
  if (reference.type === 'translation') {
    if (reference.originalAuthors && reference.originalAuthors.length > 0) {
      return reference.originalAuthors[0].lastName || '';
    }
    return reference.originalAuthorLastName || '';
  }
  const authors = getNamedAuthors(reference);
  return authors.length > 0 ? authors[0].lastName || '' : reference.composer || '';
};

// 本文中の引用に表示する著者名
const getCitationAuthorName = (reference) => {
  if (reference.type === 'website' || reference.type === 'organization-book') {
    return reference.organization || '';
  }

  if (reference.type === 'translation') {
    // 翻訳書の場合は原著者をカタカナで
    if (reference.originalAuthors && reference.originalAuthors.length > 0) {
      return reference.originalAuthors.map(author => author.lastName).join('・');
    }
    // 後方互換性：古い形式のデータをサポート
    return reference.originalAuthorLastName || '';
  }

  const authors = getNamedAuthors(reference);
  if (authors.length === 0) {
    // 楽譜・視聴覚資料は作曲者名を使用
    return reference.composer || '';
  }
  if (authors.length < 4) {
    // 3名以下：全員を記載し、中黒でつなぐ
    return authors.map(author => author.lastName).join('・');
  }
  // 4名以上：筆頭著者のみ記載し、「ほか」を付加
  return authors[0].lastName + 'ほか';
};

// 一覧・選択肢に表示する著者名
export const getAuthorDisplayName = (migratedRef) => {
  if (migratedRef.type === 'translation') {
    // 翻訳書の場合は原語表記の原著者を使用
    if (migratedRef.originalAuthorsEnglish && migratedRef.originalAuthorsEnglish.length > 0) {
      return migratedRef.originalAuthorsEnglish
        .map(author => `${author.lastName}, ${author.firstName}`)
        .join('; ');
    }
    // 新しい形式の翻訳書（日本語表記の原著者を使用）
    if (migratedRef.originalAuthors && migratedRef.originalAuthors.length > 0) {
      return migratedRef.originalAuthors
        .map(author => `${author.lastName}${author.firstName}`)
        .join('・');
    }
    // 古い形式の翻訳書（後方互換性）
    return migratedRef.originalAuthorLastName || '';
  }
  if (migratedRef.type === 'organization-book') {
    // 団体出版本の場合は執筆団体名を表示
    return migratedRef.organization || '';
  }
  if (migratedRef.authors && migratedRef.authors.length > 0) {
    return migratedRef.authors
      .map(author => `${author.lastName}${author.firstName}`)
      .join('・');
  }
  return migratedRef.composer || migratedRef.organization || '';
};

// 著者名順の並べ替えに使う読み（読み仮名がなければ表記で代用）
export const getSortReading = (migratedRef) => {
  if (migratedRef.type === 'organization-book' || migratedRef.type === 'website') {
    // 団体出版本・Webサイトは「読み仮名」を優先、なければ団体名
    return migratedRef.organizationReading || migratedRef.organization || '';
  }
  if (migratedRef.type === 'translation') {
    // 翻訳書の場合、原著者の読み（あれば）または姓を使用
    if (migratedRef.originalAuthors && migratedRef.originalAuthors.length > 0) {
      return migratedRef.originalAuthors[0].reading || migratedRef.originalAuthors[0].lastName || '';
    }
    if (migratedRef.originalAuthorsEnglish && migratedRef.originalAuthorsEnglish.length > 0) {
      return migratedRef.originalAuthorsEnglish[0].lastName || '';
    }
    return migratedRef.originalAuthorLastName || '';
  }
  return migratedRef.authors?.[0]?.reading || migratedRef.authors?.[0]?.lastName || migratedRef.composer || '';
};

// 本文中の引用形式を生成
export const formatCitation = (reference, page = '') => {
  const type = reference.type;
  const yearSuffix = reference.yearSuffix || '';
  const displayYear = `${getPublicationYear(reference)}${yearSuffix}`;
  const formattedPage = page ? formatCitationPageRange(page) : '';
  const pageText = formattedPage ? `:${formattedPage}` : '';
  const authorName = getCitationAuthorName(reference);

  if (type === 'website') {
    // Webサイトは運営団体名を使用し、年は表示しない。1件だけの場合はアルファベットも付けない
    return `(${authorName}webページ${yearSuffix ? ` ${yearSuffix}` : ''})`;
  }

  if (type === 'translation') {
    return `(${authorName}　${displayYear}(${reference.originalYear})${pageText})`;
  }

  return `(${authorName}　${displayYear}${pageText})`;
};

// 同一著者・同一年の文献を検出してアルファベットを付与する関数
export const addYearSuffixes = (references) => {
  if (!Array.isArray(references) || references.length === 0) {
    return references;
  }

  const updatedReferences = references.map((ref, idx) => ({ ref: migrateReferenceData(ref), originalIndex: idx }));

  // 著者（または組織）と年でグループ化
  const groups = {};
  updatedReferences.forEach((item) => {
    const ref = item.ref;
    const authorKey = getSuffixGroupAuthorKey(ref);
    // Webサイトは年での区別をしない（またはデータに存在しない）
    const year = ref.type === 'website' ? '' : getPublicationYear(ref);

    const groupKey = `${authorKey}_${year}`;
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
  });

  const finalReferences = [...references];

  Object.values(groups).forEach(group => {
    // 1件しかない場合でも、Webサイトの仕様（以前の実装）に合わせてサフィックスをつけるべきか？
    // 以前の実装： "if (websiteRefs.length > 1) { ... } else { //サフィックスなし }"
    // ユーザー要望：「発行団体が同じものに順番につけていくようにして」
    // -> 複数あるなら a, b... 1つなら不要、が自然。

    if (group.length > 1) {
      // 日付順などでソートして安定させる
      group.sort((a, b) => {
        const dateA = new Date(a.ref.createdAt || 0);
        const dateB = new Date(b.ref.createdAt || 0);
        return dateA - dateB;
      });

      group.forEach((item, index) => {
        const suffix = String.fromCharCode(97 + index); // a, b, c...
        finalReferences[item.originalIndex] = {
          ...item.ref,
          yearSuffix: suffix,
          displayYear: item.ref.type === 'website' ? suffix : `${getPublicationYear(item.ref)}${suffix}`
          // Webサイトの場合、 displayYear に suffix そのものを入れる運用になっている（以前のコード踏襲）
        };
      });
    } else {
      // 1件だけの場合、既存の yearSuffix を消す必要があるかもしれない（再計算のため）
      // 特にWebサイトは以前のロジックでついている可能性がある
      finalReferences[group[0].originalIndex] = {
        ...group[0].ref,
        yearSuffix: undefined,
        displayYear: group[0].ref.type === 'website' ? undefined : getPublicationYear(group[0].ref)
      };
    }
  });

  return finalReferences;
};

// 参考文献一覧の形式を生成
export const formatReference = (reference) => {
  const type = reference.type;

  switch (type) {
    case 'japanese-book':
      return formatJapaneseBook(reference);
    case 'japanese-journal':
      return formatJapaneseJournal(reference);
    case 'japanese-chapter':
      return formatJapaneseChapter(reference);
    case 'organization-book':
      return formatOrganizationBook(reference);
    case 'english-book':
      return formatEnglishBook(reference);
    case 'english-journal':
      return formatEnglishJournal(reference);
    case 'english-chapter':
      return formatEnglishChapter(reference);
    case 'translation':
      return formatTranslation(reference);
    case 'dictionary':
      return formatDictionary(reference);
    case 'score-domestic':
      return formatScoreDomestic(reference);
    case 'score-foreign':
      return formatScoreForeign(reference);
    case 'website':
      return formatWebsite(reference);
    case 'audiovisual':
      return formatAudiovisual(reference);
    default:
      return formatJapaneseBook(reference);
  }
};

// 個別のフォーマット関数
const formatJapaneseBook = (ref) => {
  const { authors, title, publisher, year, yearSuffix, editors, translators } = ref;
  const authorText = formatAuthors(authors, true, false);
  const displayYear = yearSuffix ? `${year}年${yearSuffix}` : `${year}年`;
  let result = `${authorText}『${title}』${publisher}、${displayYear}。`;
  return result;
};

const formatJapaneseJournal = (ref) => {
  const { authors, title, editorialOrganization, journalName, volume, issue, year, yearSuffix, pages } = ref;
  const authorText = formatAuthors(authors, true, false);
  const volumeIssue = formatVolumeIssue(volume, issue);
  const formattedPages = formatPageRange(pages);
  const displayYear = yearSuffix ? `${year}年${yearSuffix}` : `${year}年`;

  // 編集団体がある場合とない場合で形式を変える
  if (editorialOrganization) {
    return `${authorText}「${title}」${editorialOrganization}編『${journalName}』${volumeIssue}、${displayYear}、${formattedPages}頁。`;
  } else {
    return `${authorText}「${title}」『${journalName}』${volumeIssue}、${displayYear}、${formattedPages}頁。`;
  }
};

const formatJapaneseChapter = (ref) => {
  const { authors, title, editors, bookTitle, publisher, year, yearSuffix, pages } = ref;
  const authorText = formatAuthors(authors, true, false);
  const formattedPages = formatPageRange(pages);
  const displayYear = yearSuffix ? `${year}年${yearSuffix}` : `${year}年`;
  return `${authorText}「${title}」、${editors}編『${bookTitle}』${publisher}、${displayYear}、${formattedPages}頁。`;
};

const formatOrganizationBook = (ref) => {
  const { organization, title, year, yearSuffix } = ref;
  const displayYear = yearSuffix ? `${year}年${yearSuffix}` : `${year}年`;
  return `${organization}『${title}』、${displayYear}。`;
};

const formatEnglishBook = (ref) => {
  const { authors, title, publisherLocation, publisher, year, yearSuffix } = ref;
  const authorText = formatAuthors(authors, false, false);
  const displayYear = yearSuffix ? `${year}${yearSuffix}` : `${year}`;
  return `${authorText}. *${title}*. ${publisherLocation}: ${publisher}, ${displayYear}.`;
};

const formatEnglishJournal = (ref) => {
  const { authors, title, journalName, volume, issue, year, yearSuffix, pages } = ref;
  const authorText = formatAuthors(authors, false, false);
  let volumeIssue = '';
  if (volume && issue) {
    volumeIssue = ` ${volume}(${issue})`;
  } else if (volume) {
    volumeIssue = ` ${volume}`;
  }
  const displayYear = yearSuffix ? `${year}${yearSuffix}` : `${year}`;

  const formattedPages = pages ? formatPageRange(pages) : '';
  return `${authorText}, "${title}", *${journalName}*${volumeIssue}. (${displayYear}) pp. ${formattedPages}.`;
};

const formatEnglishChapter = (ref) => {
  const { authors, title, bookTitle, publisherLocation, publisher, year, yearSuffix, pages } = ref;
  const authorText = formatAuthors(authors, false, false);
  const formattedPages = pages ? formatPageRange(pages) : '';
  const displayYear = yearSuffix ? `${year}${yearSuffix}` : `${year}`;
  return `${authorText}, "${title}", *${bookTitle}*. (${publisherLocation}: ${publisher}, ${displayYear}) pp. ${formattedPages}.`;
};

const formatTranslation = (ref) => {
  const { originalAuthors, originalAuthorsEnglish, translators, title, publisher, year, yearSuffix, originalTitle, originalPublisherLocation, originalPublisher, originalYear } = ref;

  // 原著者を日本語形式でフォーマット
  const originalAuthorTextJapanese = formatAuthors(originalAuthors, true, false);

  // 訳者を日本語形式でフォーマット（最後に「訳」を付加）
  const translatorText = formatAuthors(translators, true, false) + '訳';

  // 原書の著者を英語形式でフォーマット
  const originalAuthorEnglish = formatAuthors(originalAuthorsEnglish, false, false);

  const displayYear = yearSuffix ? `${year}年${yearSuffix}` : `${year}年`;

  return `${originalAuthorTextJapanese}、${translatorText}『${title}』、${publisher}、${displayYear}。(${originalAuthorEnglish}. *${originalTitle}*. ${originalPublisherLocation}: ${originalPublisher}, ${originalYear}.)`;
};

const formatDictionary = (ref) => {
  const { authors, title, dictionaryTitle, volume, publisher, year, yearSuffix, pages } = ref;
  const authorText = formatAuthors(authors, true, false);
  const volumeText = volume ? `第${formatNumber(volume)}巻、` : '';
  const formattedPages = formatPageRange(pages);
  const displayYear = yearSuffix ? `${year}年${yearSuffix}` : `${year}年`;
  return `${authorText}「${title}」『${dictionaryTitle}』${volumeText}${publisher}、${displayYear}、${formattedPages}頁。`;
};

const formatScoreDomestic = (ref) => {
  const { composer, title, collectionTitle, editor, publisherLocation, publisher, year, yearSuffix } = ref;
  const collection = collectionTitle ? ` ${collectionTitle}` : '';
  const editorText = editor ? ` ${editor}` : '';
  const displayYear = yearSuffix ? `${year}年${yearSuffix}` : `${year}年`;
  return `${composer} ${title}${collection}${editorText} ${publisherLocation}:${publisher} ${displayYear}`;
};

const formatScoreForeign = (ref) => {
  const { composer, title, collectionTitle, editor, catalogNumber, publisherLocation, publisher, year, yearSuffix } = ref;
  const collection = collectionTitle ? ` ${collectionTitle}` : '';
  const editorText = editor ? ` ${editor}.` : '';
  const displayYear = yearSuffix ? `${year}${yearSuffix}` : `${year}`;
  return `${composer}. ${title}${collection}.${editorText} ${catalogNumber}. ${publisherLocation}: ${publisher}, ${displayYear}`;
};

const formatWebsite = (ref) => {
  const { organization, title, url, accessDate, yearSuffix } = ref;
  // "YYYY-MM-DD" を new Date() に渡すとUTCとして解釈され、日本より西のタイムゾーンでは前日になるため、ローカル日付として組み立てる
  const isoDateMatch = accessDate ? accessDate.match(/^(\d{4})-(\d{2})-(\d{2})$/) : null;
  const accessDateObj = isoDateMatch
    ? new Date(Number(isoDateMatch[1]), Number(isoDateMatch[2]) - 1, Number(isoDateMatch[3]))
    : new Date(accessDate);
  // アルファベットサフィックスがあれば末尾に付加
  const formattedDate = accessDate ? accessDateObj.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';
  const suffix = yearSuffix ? yearSuffix : '';
  return `${organization}webサイト 「${title}」 ${url} (${formattedDate}閲覧)${suffix}`;
};

const formatAudiovisual = (ref) => {
  const { composer, title, performers, label, mediaType, catalogNumber, trackNumber, recordingYear, releaseYear, yearSuffix } = ref;
  const track = trackNumber ? `、トラック${formatNumber(trackNumber)}` : '';
  const recording = recordingYear ? `、${recordingYear}年録音` : '';
  const displayReleaseYear = yearSuffix ? `${releaseYear}年${yearSuffix}` : `${releaseYear}年`;
  return `${composer}作曲《${title}》 ${performers}演奏、${label}: ${catalogNumber}(${mediaType})${track}${recording}・${displayReleaseYear}発売。`;
};

// 数字フォーマット用のユーティリティ関数
export const formatNumber = (num) => {
  if (!num) return '';
  const numStr = num.toString();

  // 1桁の場合は全角、2桁以上の場合は半角
  if (numStr.length === 1) {
    const zenkakuMap = {
      '0': '０', '1': '１', '2': '２', '3': '３', '4': '４',
      '5': '５', '6': '６', '7': '７', '8': '８', '9': '９'
    };
    return zenkakuMap[numStr] || numStr;
  } else {
    return numStr; // 2桁以上は半角のまま
  }
};

// ページ範囲をフォーマットする関数（波線使用）
export const formatPageRange = (pages) => {
  if (!pages) return '';

  // ハイフンを波線に変換し、数字を適切にフォーマット
  // インポートしたJSONではページが数値のこともあるため文字列化する
  return String(pages)
    .replace(/-/g, '〜') // ハイフンを波線に変換
    .replace(/\b(\d+)\b/g, (match) => formatNumber(match)); // 数字をフォーマット
};

// 引用でのページ範囲をフォーマットする関数（ハイフン使用）
export const formatCitationPageRange = (pages) => {
  if (!pages) return '';

  // 引用ではハイフンのまま、数字を適切にフォーマット
  return String(pages)
    .replace(/\b(\d+)\b/g, (match) => formatNumber(match)); // 数字をフォーマット
};

// 巻号をフォーマットする関数
export const formatVolumeIssue = (volume, issue) => {
  let result = '';
  if (volume && issue) {
    result = `第${formatNumber(volume)}-${formatNumber(issue)}号`;
  } else if (volume) {
    result = `第${formatNumber(volume)}巻`;
  } else if (issue) {
    result = `第${formatNumber(issue)}号`;
  }
  return result;
};

// 既存データのマイグレーション関数（後方互換性のため）
export const migrateReferenceData = (reference) => {
  let migratedRef = { ...reference };

  // 既存の単一著者データを複数著者形式に変換
  if (!migratedRef.authors && (migratedRef.authorLastName || migratedRef.authorFirstName)) {
    migratedRef.authors = [{
      lastName: migratedRef.authorLastName || '',
      firstName: migratedRef.authorFirstName || '',
      reading: migratedRef.authorReading || ''
    }];
  }

  // 翻訳書の古い形式を新しい形式に変換
  if (migratedRef.type === 'translation') {
    // 原著者の変換（日本語表記）
    if (!migratedRef.originalAuthors && (migratedRef.originalAuthorLastName || migratedRef.originalAuthorFirstName)) {
      migratedRef.originalAuthors = [{
        lastName: migratedRef.originalAuthorLastName || '',
        firstName: migratedRef.originalAuthorFirstName || '',
        reading: ''
      }];
    }

    // 原著者の英語表記がない場合は日本語表記から推測
    if (!migratedRef.originalAuthorsEnglish && migratedRef.originalAuthors) {
      migratedRef.originalAuthorsEnglish = migratedRef.originalAuthors.map(author => ({
        lastName: author.lastName || '',
        firstName: author.firstName || '',
        reading: ''
      }));
    }

    // 訳者の変換（複数著者形式に変更）
    if (migratedRef.translatorNames && typeof migratedRef.translatorNames === 'string') {
      // 文字列形式の訳者を配列に変換
      const translatorNames = migratedRef.translatorNames.split('・');
      migratedRef.translators = translatorNames.map(name => {
        const trimmedName = name.trim();
        // 日本語名を姓・名に分割（完全ではないが、一般的なパターンを処理）
        const lastChar = trimmedName.slice(-1);
        if (trimmedName.length >= 2) {
          return {
            lastName: trimmedName.slice(0, -1),
            firstName: lastChar,
            reading: ''
          };
        } else {
          return {
            lastName: trimmedName,
            firstName: '',
            reading: ''
          };
        }
      }).filter(translator => translator.lastName);
    } else if (!migratedRef.translators || !Array.isArray(migratedRef.translators)) {
      migratedRef.translators = [{ lastName: '', firstName: '', reading: '' }];
    }
  }

  // authorsが存在しない場合はデフォルトで空の配列を設定
  if (!migratedRef.authors || !Array.isArray(migratedRef.authors)) {
    migratedRef.authors = [];
  }

  return migratedRef;
};
