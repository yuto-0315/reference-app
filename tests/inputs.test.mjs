// 外部から入ってくる値（書誌データの著者名、URL）の扱いを確かめる
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { stripCreatorRole } from '../src/utils/api.js';
import { toSafeHref, toDoiHref } from '../src/utils/safeUrl.js';
import { applyFieldValue, getBulkEditableFields } from '../src/utils/bulkEdit.js';

test('著者名から「編」「[著]」などの役割を外す。名前の一部（山田耕作の「作」）は残す', () => {
  const cases = {
    '文部科学省 編': '文部科学省',
    '佐藤 [著]': '佐藤',
    '鈴木花子 編著': '鈴木花子',
    '国立音楽大学（編）': '国立音楽大学',
    'Smith, John ed.': 'Smith, John',
    '山田耕作': '山田耕作',
    '山田耕作 作曲': '山田耕作',
    'Grout, Donald J.': 'Grout, Donald J.'
  };
  Object.entries(cases).forEach(([input, expected]) => assert.equal(stripCreatorRole(input), expected, input));
});

test('リンクにするのは http と https のURLだけ', () => {
  assert.equal(toSafeHref('https://example.com/a'), 'https://example.com/a');
  assert.equal(toSafeHref('javascript:alert(1)'), null);
  assert.equal(toSafeHref('data:text/html,x'), null);
  assert.equal(toSafeHref('not a url'), null);
  assert.equal(toDoiHref('10.1234/abc'), 'https://doi.org/10.1234/abc');
  assert.equal(toDoiHref('https://doi.org/10.1234/abc'), 'https://doi.org/10.1234/abc');
  assert.equal(toDoiHref('javascript:alert(1)'), null);
});

test('まとめて編集：項目のある文献だけを変え、すでに同じ値の文献はそのままにする', () => {
  const refs = [
    { id: 'a', type: 'japanese-book', publisher: '音楽之友社' },
    { id: 'b', type: 'japanese-book', publisher: '音楽の友社' },
    { id: 'c', type: 'website', organization: '文化庁' }
  ];
  const publisherField = getBulkEditableFields(refs).find(field => field.key === 'publisher');
  assert.deepEqual(publisherField.referenceIds, ['a', 'b']);
  const next = applyFieldValue(refs, publisherField.referenceIds, publisherField, '音楽之友社', 'now');
  assert.equal(next[0], refs[0]);
  assert.equal(next[1].publisher, '音楽之友社');
  assert.equal(next[2], refs[2]);
});
