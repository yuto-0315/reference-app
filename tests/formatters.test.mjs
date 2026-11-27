// 参考文献一覧・本文中の引用の形が崩れていないかを確かめる（形式は「参考文献書方.md」に従う）
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  formatReference, formatCitation, addYearSuffixes, getSortReading, buildSortReadingLookup, isSortReadingMissing
} from '../src/utils/formatters.js';

const person = (lastName, firstName, reading = '') => ({ lastName, firstName, reading });

test('日本語書籍', () => {
  const ref = { type: 'japanese-book', authors: [person('山田', '太郎')], title: '音楽教育の研究', publisher: '音楽之友社', year: 2020 };
  assert.equal(formatReference(ref), '山田太郎『音楽教育の研究』音楽之友社、2020年。');
  assert.equal(formatCitation(ref, '12'), '(山田　2020:12)');
});

test('ページ範囲は、一覧では「〜」、引用では「-」にそろえる（入力の区切りがまちまちでも）', () => {
  const ref = { type: 'japanese-journal', authors: [person('岡本', '千佳')], title: '論文', journalName: '雑誌', issue: '47', year: 2017, pages: '15~28' };
  assert.match(formatReference(ref), /15〜28頁。$/);
  for (const page of ['15~28', '15～28', '15〜28', '15ー28', '15-28']) {
    assert.equal(formatCitation(ref, page), '(岡本　2017:15-28)', page);
  }
});

test('「pp.」「頁」「第」「号」「編」まで入力されていても二重にしない', () => {
  const ref = {
    type: 'japanese-journal', authors: [person('権藤', '敦子')], title: '昭和初期の音楽教育', journalName: '音楽教育史研究',
    editorialOrganization: '音楽教育史学会 編', issue: '第8号', year: 2005, pages: 'pp.13~25頁'
  };
  assert.equal(formatReference(ref), '権藤敦子「昭和初期の音楽教育」音楽教育史学会編『音楽教育史研究』第８号、2005年、13〜25頁。');
});

test('英語文献：名が「.」で終わっても「..」にせず、巻号・ページは半角にする', () => {
  const book = { type: 'english-book', authors: [person('Grout', 'Donald J.')], title: 'A History of Western Music', publisherLocation: 'New York', publisher: 'Norton', year: 1960 };
  assert.equal(formatReference(book), 'Grout, Donald J. *A History of Western Music*. New York: Norton, 1960.');
  const journal = { type: 'english-journal', authors: [person('Smith', 'John')], title: 'Music', journalName: 'Journal', volume: '３', issue: '2', year: 2001, pages: '１２-３４' };
  assert.equal(formatReference(journal), 'Smith, John, "Music", *Journal* 3(2). (2001) pp. 12-34.');
  assert.equal(formatCitation(journal, '５'), '(Smith　2001:5)');
});

test('翻訳書：原著者は「姓、名」、4名以上は「ほか」', () => {
  const ref = {
    type: 'translation',
    originalAuthors: [person('グラウト', 'ドナルド'), person('パリスカ', 'クロード'), person('バークホルダー', 'ピーター'), person('ボナー', 'ジェームズ')],
    originalAuthorsEnglish: [person('Grout', 'Donald J.')], translators: [person('戸口', '幸策')],
    title: '西洋音楽史', publisher: '音楽之友社', year: 1998,
    originalTitle: 'A History', originalPublisherLocation: 'New York', originalPublisher: 'Norton', originalYear: 1996
  };
  assert.equal(formatReference(ref), 'グラウト、ドナルドほか、戸口幸策訳『西洋音楽史』、音楽之友社、1998年。(Grout, Donald J. *A History*. New York: Norton, 1996.)');
  assert.equal(formatCitation(ref), '(グラウトほか　1998(1996))');
});

test('視聴覚資料：録音年がなければ「・」を残さない', () => {
  const base = { type: 'audiovisual', composer: '武満徹', title: 'ノヴェンバー・ステップス', performers: '小澤征爾', label: 'RCA', catalogNumber: 'BVCC-1', mediaType: 'CD', releaseYear: 1990 };
  assert.equal(formatReference(base), '武満徹作曲《ノヴェンバー・ステップス》 小澤征爾演奏、RCA: BVCC-1(CD)、1990年発売。');
  assert.equal(formatReference({ ...base, recordingYear: 1967 }), '武満徹作曲《ノヴェンバー・ステップス》 小澤征爾演奏、RCA: BVCC-1(CD)、1967年録音・1990年発売。');
});

test('空の著者や欠けた項目で「undefined」を出さない', () => {
  const ref = { type: 'japanese-book', authors: [person('文部省', ''), person('', '')], title: 'T', publisher: 'P', year: 1950 };
  assert.equal(formatReference(ref), '文部省『T』P、1950年。');
  const missing = { type: 'japanese-book', authors: [{ lastName: '山田' }], title: 'T' };
  assert.doesNotMatch(formatReference(missing), /undefined/);
  assert.doesNotMatch(formatCitation(missing), /undefined/);
});

test('同じ著者・同じ年の文献に、登録順で a, b を付ける', () => {
  const refs = [
    { id: '1', type: 'japanese-book', authors: [person('山田', '太郎')], title: 'A', publisher: 'P', year: 2020, createdAt: '2024-01-02' },
    { id: '2', type: 'japanese-book', authors: [person('山田', '太郎')], title: 'B', publisher: 'P', year: 2020, createdAt: '2024-01-01' },
    { id: '3', type: 'japanese-book', authors: [person('山田', '太郎')], title: 'C', publisher: 'P', year: 2021, createdAt: '2024-01-03' }
  ];
  const suffixById = Object.fromEntries(addYearSuffixes(refs).map(ref => [ref.id, ref.yearSuffix || '']));
  assert.deepEqual(suffixById, { 1: 'b', 2: 'a', 3: '' });
});

test('読み仮名のない文献は、同じ名前の別の文献の読み仮名で並べる', () => {
  const withReading = { id: '1', type: 'organization-book', organization: '文部科学省', organizationReading: 'もんぶかがくしょう', title: 'A', year: 2017 };
  const withoutReading = { id: '2', type: 'organization-book', organization: '文部科学省', title: 'B', year: 2018 };
  const lookup = buildSortReadingLookup([withReading, withoutReading]);
  assert.equal(getSortReading(withoutReading, lookup), 'もんぶかがくしょう');
  assert.equal(isSortReadingMissing(withoutReading, lookup), false);
  assert.equal(isSortReadingMissing({ id: '3', type: 'organization-book', organization: '文化庁', title: 'C', year: 2019 }, lookup), true);
});
