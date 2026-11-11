// 著者名・団体名の読み仮名を、Web NDL Authorities（国立国会図書館の典拠データ）から調べる
// https://id.ndl.go.jp/information/sparql-11/
import { fetchFromApi, invalidResponseError } from './apiErrors';

const SPARQL_ENDPOINT = 'https://id.ndl.go.jp/auth/ndla/sparql';
// 同姓同名などで候補が多すぎると選びにくいため、上位だけ出す
const MAX_CANDIDATES = 8;

const readingCache = new Map();

// SPARQL の文字列の中で特別な意味を持つ文字を無効にする（入力がそのまま検索式として解釈されないように）
const escapeSparqlString = (text) => text
  .replace(/\\/g, '\\\\')
  .replace(/"/g, '\\"')
  .replace(/[\r\n]+/g, ' ');

const katakanaToHiragana = (text) => text.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));

// 典拠の読み「ナツメ, ソウセキ, 1867-1916」を、このアプリの読み仮名の書き方「なつめそうせき」にする
const toAppReading = (kana) => katakanaToHiragana(
  kana
    .replace(/,?\s*\d{3,4}-(\d{3,4})?\s*$/, '')
    .replace(/[\s,、・.]/g, '')
);

// 典拠の名前では、人名は「姓, 名」の順に「, 」で区切られている
const buildSearchLabel = ({ kind, name, lastName, firstName }) => (
  kind === 'person' ? [lastName, firstName].map(s => (s || '').trim()).filter(Boolean).join(', ') : (name || '').trim()
);

// 前方一致で探し、生没年や下位組織が付いた名前（「夏目, 漱石, 1867-1916」「文部科学省. 初等中等教育局」）も候補に含める
const buildQuery = (label) => `PREFIX xl: <http://www.w3.org/2008/05/skos-xl#>
PREFIX ndl: <http://ndl.go.jp/dcndl/terms/>
SELECT DISTINCT ?label ?yomi WHERE {
  ?l xl:literalForm ?label ; ndl:transcription ?yomi .
  ?auth xl:prefLabel ?l .
  FILTER(STRSTARTS(?label, "${escapeSparqlString(label)}"))
  FILTER(lang(?yomi) = "ja-kana")
} LIMIT 50`;

// 完全に一致する名前を先に、次に「姓, 名, 生没年」のように区切って続く名前を出す（「漱石子」のような別人は除く）。
// 団体名は、完全に一致する名前があれば下位組織（「文部科学省. 初等中等教育局」）を候補に出さない
const rankCandidates = (rows, label, kind) => {
  const candidates = rows
    .map(row => ({ label: row.label.value, reading: toAppReading(row.yomi.value) }))
    .filter(candidate => candidate.reading && (candidate.label === label || /^[,.\s]/.test(candidate.label.slice(label.length))))
    .sort((a, b) => (a.label === label ? 0 : 1) - (b.label === label ? 0 : 1) || a.label.length - b.label.length)
    .filter((candidate, index, list) => list.findIndex(other => other.label === candidate.label && other.reading === candidate.reading) === index);
  const exactMatches = candidates.filter(candidate => candidate.label === label);
  return (kind === 'organization' && exactMatches.length > 0 ? exactMatches : candidates).slice(0, MAX_CANDIDATES);
};

/**
 * 読み仮名の候補を返す。見つからなければ空の配列
 * @param {{ kind: 'person' | 'organization', name?: string, lastName?: string, firstName?: string }} target
 * @returns {Promise<Array<{ label: string, reading: string }>>}
 */
export const lookupReadingCandidates = async (target) => {
  const label = buildSearchLabel(target);
  if (!label) return [];
  const cacheKey = `${target.kind}:${label}`;
  if (readingCache.has(cacheKey)) return readingCache.get(cacheKey);

  const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(buildQuery(label))}`;
  const response = await fetchFromApi(url, 'ndla');
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw invalidResponseError('ndla');
  }
  const rows = data?.results?.bindings;
  if (!Array.isArray(rows)) throw invalidResponseError('ndla');

  const candidates = rankCandidates(rows, label, target.kind);
  readingCache.set(cacheKey, candidates);
  return candidates;
};

// 調べられるだけの名前が入っているか（人名は姓が必要）
export const canLookupReading = ({ kind, name, lastName }) => Boolean(((kind === 'person' ? lastName : name) || '').trim());
