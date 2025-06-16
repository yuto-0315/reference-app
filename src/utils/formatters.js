// 文献種別の定義
export const REFERENCE_TYPES = {
  'japanese-book': '日本語書籍',
  'japanese-journal': '日本語雑誌論文',
  'japanese-chapter': '日本語書籍所収論文',
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
      { key: 'authorLastName', label: '著者姓', required: true, type: 'text' },
      { key: 'authorFirstName', label: '著者名', required: true, type: 'text' },
      { key: 'title', label: '書名', required: true, type: 'text' },
      { key: 'publisher', label: '出版社', required: true, type: 'text' },
      { key: 'year', label: '出版年', required: true, type: 'number' },
      { key: 'editors', label: '編者名', required: false, type: 'text' },
      { key: 'translators', label: '訳者名', required: false, type: 'text' }
    ],
    
    'japanese-journal': [
      { key: 'authorLastName', label: '執筆者姓', required: true, type: 'text' },
      { key: 'authorFirstName', label: '執筆者名', required: true, type: 'text' },
      { key: 'title', label: '論文名', required: true, type: 'text' },
      { key: 'journalName', label: '雑誌名', required: true, type: 'text' },
      { key: 'volume', label: '巻', required: false, type: 'text' },
      { key: 'issue', label: '号', required: false, type: 'text' },
      { key: 'year', label: '出版年', required: true, type: 'number' },
      { key: 'pages', label: '掲載ページ', required: true, type: 'text' }
    ],
    
    'japanese-chapter': [
      { key: 'authorLastName', label: '執筆者姓', required: true, type: 'text' },
      { key: 'authorFirstName', label: '執筆者名', required: true, type: 'text' },
      { key: 'title', label: '論文名', required: true, type: 'text' },
      { key: 'editors', label: '編者名', required: true, type: 'text' },
      { key: 'bookTitle', label: '書名', required: true, type: 'text' },
      { key: 'publisher', label: '出版社', required: true, type: 'text' },
      { key: 'year', label: '出版年', required: true, type: 'number' },
      { key: 'pages', label: '掲載ページ', required: true, type: 'text' }
    ],
    
    'english-book': [
      { key: 'authorLastName', label: 'Author Last Name', required: true, type: 'text' },
      { key: 'authorFirstName', label: 'Author First Name', required: true, type: 'text' },
      { key: 'title', label: 'Book Title', required: true, type: 'text' },
      { key: 'publisherLocation', label: 'Publisher Location', required: true, type: 'text' },
      { key: 'publisher', label: 'Publisher', required: true, type: 'text' },
      { key: 'year', label: 'Publication Year', required: true, type: 'number' }
    ],
    
    'english-journal': [
      { key: 'authorLastName', label: 'Author Last Name', required: true, type: 'text' },
      { key: 'authorFirstName', label: 'Author First Name', required: true, type: 'text' },
      { key: 'title', label: 'Article Title', required: true, type: 'text' },
      { key: 'journalName', label: 'Journal Name', required: true, type: 'text' },
      { key: 'volume', label: 'Volume', required: false, type: 'text' },
      { key: 'issue', label: 'Issue', required: false, type: 'text' },
      { key: 'year', label: 'Publication Year', required: true, type: 'number' },
      { key: 'pages', label: 'Pages', required: true, type: 'text' }
    ],
    
    'english-chapter': [
      { key: 'authorLastName', label: 'Author Last Name', required: true, type: 'text' },
      { key: 'authorFirstName', label: 'Author First Name', required: true, type: 'text' },
      { key: 'title', label: 'Chapter Title', required: true, type: 'text' },
      { key: 'bookTitle', label: 'Book Title', required: true, type: 'text' },
      { key: 'publisherLocation', label: 'Publisher Location', required: true, type: 'text' },
      { key: 'publisher', label: 'Publisher', required: true, type: 'text' },
      { key: 'year', label: 'Publication Year', required: true, type: 'number' },
      { key: 'pages', label: 'Pages', required: true, type: 'text' }
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
      { key: 'authorLastName', label: '項目執筆者姓', required: true, type: 'text' },
      { key: 'authorFirstName', label: '項目執筆者名', required: true, type: 'text' },
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

// 本文中の引用形式を生成
export const formatCitation = (reference, page = '') => {
  const type = reference.type;
  const year = reference.year;
  const pageText = page ? `: ${page}` : '';
  
  // 著者名の取得
  let authorName = '';
  if (type === 'translation') {
    // 翻訳書の場合は原著者をカタカナで
    authorName = reference.originalAuthorLastName || '';
    const originalYear = reference.originalYear;
    return `(${authorName} ${year}(${originalYear})${pageText})`;
  } else if (type.startsWith('english')) {
    // 英語文献の場合
    authorName = reference.authorLastName || '';
  } else {
    // 日本語文献の場合、姓のみ使用
    authorName = reference.authorLastName || '';
  }
  
  return `(${authorName} ${year}${pageText})`;
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
  const { authorLastName, authorFirstName, title, publisher, year, editors, translators } = ref;
  let result = `${authorLastName}${authorFirstName}『${title}』${publisher}、${year}年。`;
  return result;
};

const formatJapaneseJournal = (ref) => {
  const { authorLastName, authorFirstName, title, journalName, volume, issue, year, pages } = ref;
  let volumeIssue = '';
  if (volume && issue) {
    volumeIssue = `第${volume}-${issue}号`;
  } else if (volume) {
    volumeIssue = `第${volume}巻`;
  } else if (issue) {
    volumeIssue = `第${issue}号`;
  }
  
  return `${authorLastName}${authorFirstName}「${title}」『${journalName}』${volumeIssue}、${year}年、${pages}頁。`;
};

const formatJapaneseChapter = (ref) => {
  const { authorLastName, authorFirstName, title, editors, bookTitle, publisher, year, pages } = ref;
  return `${authorLastName}${authorFirstName}「${title}」、${editors}編『${bookTitle}』${publisher}、${year}年、${pages}頁。`;
};

const formatEnglishBook = (ref) => {
  const { authorLastName, authorFirstName, title, publisherLocation, publisher, year } = ref;
  return `${authorLastName}, ${authorFirstName}. *${title}*. ${publisherLocation}: ${publisher}, ${year}.`;
};

const formatEnglishJournal = (ref) => {
  const { authorLastName, authorFirstName, title, journalName, volume, issue, year, pages } = ref;
  let volumeIssue = '';
  if (volume && issue) {
    volumeIssue = ` ${volume}(${issue})`;
  } else if (volume) {
    volumeIssue = ` ${volume}`;
  }
  
  return `${authorLastName}, ${authorFirstName}, "${title}", *${journalName}*${volumeIssue}. (${year}) pp. ${pages}.`;
};

const formatEnglishChapter = (ref) => {
  const { authorLastName, authorFirstName, title, bookTitle, publisherLocation, publisher, year, pages } = ref;
  return `${authorLastName}, ${authorFirstName}, "${title}", *${bookTitle}*. (${publisherLocation}: ${publisher}, ${year}) pp. ${pages}.`;
};

const formatTranslation = (ref) => {
  const { originalAuthorLastName, originalAuthorFirstName, translators, title, publisher, year, originalTitle, originalPublisherLocation, originalPublisher, originalYear } = ref;
  return `${originalAuthorLastName}${originalAuthorFirstName}、${translators}訳『${title}』、${publisher}、${year}年。(${originalAuthorLastName}, ${originalAuthorFirstName}. *${originalTitle}*. ${originalPublisherLocation}: ${originalPublisher}, ${originalYear}.)`;
};

const formatDictionary = (ref) => {
  const { authorLastName, authorFirstName, title, dictionaryTitle, volume, publisher, year, pages } = ref;
  const volumeText = volume ? `第${volume}巻、` : '';
  return `${authorLastName}${authorFirstName}「${title}」『${dictionaryTitle}』${volumeText}${publisher}、${year}年、${pages}頁。`;
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
  const track = trackNumber ? `、トラック${trackNumber}` : '';
  const recording = recordingYear ? `、${recordingYear}年録音` : '';
  return `${composer}作曲《${title}》 ${performers}演奏、${label}: ${catalogNumber}(${mediaType})${track}${recording}・${releaseYear}年発売。`;
};
