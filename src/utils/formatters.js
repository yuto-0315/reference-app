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

// 各文献種別に必要なフィールド
export const getReferenceTypeFields = (type) => {
  const commonFields = ['authors', 'title', 'year', 'publisher'];

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
      { key: 'originalAuthorLastName', label: '原著者姓', required: true, type: 'text' },
      { key: 'originalAuthorFirstName', label: '原著者名', required: true, type: 'text' },
      { key: 'translators', label: '訳者名', required: true, type: 'text' },
      { key: 'title', label: '翻訳書名', required: true, type: 'text' },
      { key: 'publisher', label: '出版社', required: true, type: 'text' },
      { key: 'year', label: '翻訳書出版年', required: true, type: 'number' },
      { key: 'originalTitle', label: '原書名', required: true, type: 'text' },
      { key: 'originalPublisherLocation', label: '原書出版地', required: true, type: 'text' },
      { key: 'originalPublisher', label: '原書出版社', required: true, type: 'text' },
      { key: 'originalYear', label: '原書出版年', required: true, type: 'number' }
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
      { key: 'organization', label: 'ウェブサイト運営団体名', required: true, type: 'text' },
      { key: 'title', label: 'ページタイトル', required: true, type: 'text' },
      { key: 'url', label: 'URL', required: true, type: 'url' },
      { key: 'accessDate', label: '閲覧年月日', required: true, type: 'date' }
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

  // 3名まで：全員を記載し、中黒でつなぐ
  // 4名以上：筆頭著者のみ記載し、「ほか」を付加
  if (authors.length <= 3) {
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

// 本文中の引用形式を生成
export const formatCitation = (reference, page = '') => {
  const type = reference.type;
  const year = reference.year;
  const formattedPage = page ? formatCitationPageRange(page) : '';
  const pageText = formattedPage ? `:${formattedPage}` : '';

  // 著者名の取得
  let authorName = '';
  if (type === 'translation') {
    // 翻訳書の場合は原著者をカタカナで
    authorName = reference.originalAuthorLastName || '';
    const originalYear = reference.originalYear;
    return `(${authorName}　${year}(${originalYear})${pageText})`;
  } else if (type === 'organization-book') {
    // 団体出版本の場合は団体名を使用
    authorName = reference.organization || '';
  } else {
    // 引用形式では筆頭著者の姓のみ使用
    if (reference.authors && reference.authors.length > 0) {
      authorName = reference.authors[0].lastName || '';
    }
  }

  return `(${authorName}　${year}${pageText})`;
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
  const { authors, title, publisher, year, editors, translators } = ref;
  const authorText = formatAuthors(authors, true, false);
  let result = `${authorText}『${title}』${publisher}、${year}年。`;
  return result;
};

const formatJapaneseJournal = (ref) => {
  const { authors, title, editorialOrganization, journalName, volume, issue, year, pages } = ref;
  const authorText = formatAuthors(authors, true, false);
  const volumeIssue = formatVolumeIssue(volume, issue);
  const formattedPages = formatPageRange(pages);

  // 編集団体がある場合とない場合で形式を変える
  if (editorialOrganization) {
    return `${authorText}「${title}」${editorialOrganization}編『${journalName}』${volumeIssue}、${year}年、${formattedPages}頁。`;
  } else {
    return `${authorText}「${title}」『${journalName}』${volumeIssue}、${year}年、${formattedPages}頁。`;
  }
};

const formatJapaneseChapter = (ref) => {
  const { authors, title, editors, bookTitle, publisher, year, pages } = ref;
  const authorText = formatAuthors(authors, true, false);
  const formattedPages = formatPageRange(pages);
  return `${authorText}「${title}」、${editors}編『${bookTitle}』${publisher}、${year}年、${formattedPages}頁。`;
};

const formatOrganizationBook = (ref) => {
  const { organization, title, year } = ref;
  return `${organization}『${title}』、${year}年。`;
};

const formatEnglishBook = (ref) => {
  const { authors, title, publisherLocation, publisher, year } = ref;
  const authorText = formatAuthors(authors, false, false);
  return `${authorText}. *${title}*. ${publisherLocation}: ${publisher}, ${year}.`;
};

const formatEnglishJournal = (ref) => {
  const { authors, title, journalName, volume, issue, year, pages } = ref;
  const authorText = formatAuthors(authors, false, false);
  let volumeIssue = '';
  if (volume && issue) {
    volumeIssue = ` ${volume}(${issue})`;
  } else if (volume) {
    volumeIssue = ` ${volume}`;
  }

  const formattedPages = pages ? formatPageRange(pages) : '';
  return `${authorText}, "${title}", *${journalName}*${volumeIssue}. (${year}) pp. ${formattedPages}.`;
};

const formatEnglishChapter = (ref) => {
  const { authors, title, bookTitle, publisherLocation, publisher, year, pages } = ref;
  const authorText = formatAuthors(authors, false, false);
  const formattedPages = pages ? formatPageRange(pages) : '';
  return `${authorText}, "${title}", *${bookTitle}*. (${publisherLocation}: ${publisher}, ${year}) pp. ${formattedPages}.`;
};

const formatTranslation = (ref) => {
  const { originalAuthorLastName, originalAuthorFirstName, translators, title, publisher, year, originalTitle, originalPublisherLocation, originalPublisher, originalYear } = ref;
  return `${originalAuthorLastName}${originalAuthorFirstName}、${translators}訳『${title}』、${publisher}、${year}年。(${originalAuthorLastName}, ${originalAuthorFirstName}. *${originalTitle}*. ${originalPublisherLocation}: ${originalPublisher}, ${originalYear}.)`;
};

const formatDictionary = (ref) => {
  const { authors, title, dictionaryTitle, volume, publisher, year, pages } = ref;
  const authorText = formatAuthors(authors, true, false);
  const volumeText = volume ? `第${formatNumber(volume)}巻、` : '';
  const formattedPages = formatPageRange(pages);
  return `${authorText}「${title}」『${dictionaryTitle}』${volumeText}${publisher}、${year}年、${formattedPages}頁。`;
};

const formatScoreDomestic = (ref) => {
  const { composer, title, collectionTitle, editor, publisherLocation, publisher, year } = ref;
  const collection = collectionTitle ? ` ${collectionTitle}` : '';
  const editorText = editor ? ` ${editor}` : '';
  return `${composer} ${title}${collection}${editorText} ${publisherLocation}:${publisher} ${year}`;
};

const formatScoreForeign = (ref) => {
  const { composer, title, collectionTitle, editor, catalogNumber, publisherLocation, publisher, year } = ref;
  const collection = collectionTitle ? ` ${collectionTitle}` : '';
  const editorText = editor ? ` ${editor}.` : '';
  return `${composer}. ${title}${collection}.${editorText} ${catalogNumber}. ${publisherLocation}: ${publisher}, ${year}`;
};

const formatWebsite = (ref) => {
  const { organization, title, url, accessDate } = ref;
  const formattedDate = new Date(accessDate).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return `${organization}ウェブサイト 「${title}」 ${url} (${formattedDate}閲覧)`;
};

const formatAudiovisual = (ref) => {
  const { composer, title, performers, label, mediaType, catalogNumber, trackNumber, recordingYear, releaseYear } = ref;
  const track = trackNumber ? `、トラック${formatNumber(trackNumber)}` : '';
  const recording = recordingYear ? `、${recordingYear}年録音` : '';
  return `${composer}作曲《${title}》 ${performers}演奏、${label}: ${catalogNumber}(${mediaType})${track}${recording}・${releaseYear}年発売。`;
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
  return pages
    .replace(/-/g, '〜') // ハイフンを波線に変換
    .replace(/\b(\d+)\b/g, (match) => formatNumber(match)); // 数字をフォーマット
};

// 引用でのページ範囲をフォーマットする関数（ハイフン使用）
export const formatCitationPageRange = (pages) => {
  if (!pages) return '';

  // 引用ではハイフンのまま、数字を適切にフォーマット
  return pages
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
  // 既存の単一著者データを複数著者形式に変換
  if (!reference.authors && (reference.authorLastName || reference.authorFirstName)) {
    return {
      ...reference,
      authors: [{
        lastName: reference.authorLastName || '',
        firstName: reference.authorFirstName || '',
        reading: reference.authorReading || ''
      }]
    };
  }

  // 既に複数著者形式の場合はそのまま
  if (reference.authors && Array.isArray(reference.authors)) {
    return reference;
  }

  // authorsが存在しない場合はデフォルトで空の配列を設定
  return {
    ...reference,
    authors: reference.authors || []
  };
};
