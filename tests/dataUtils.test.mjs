// 文献データの読み込み・取り込み・元に戻す処理で、データが消えたり壊れたりしないかを確かめる
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planImport, createUndo, removeContentDuplicates, sanitizeReference, validateAndCleanData } from '../src/utils/dataUtils.js';

const book = (id, title, updatedAt = '2024-01-01T00:00:00Z') => ({
  id, type: 'japanese-book', title, authors: [{ lastName: '山田', firstName: '太郎', reading: '' }], publisher: 'P', year: 2000, updatedAt
});

const sequentialIds = () => {
  let count = 0;
  return () => `new-${++count}`;
};

test('取り込み：同じIDは新しいほうの内容にし、ないものは追加、同じ内容はとばす', () => {
  const existing = [book('a', 'A'), book('b', 'B')];
  const plan = planImport(existing, [
    book('a', 'A（直した）', '2025-01-01T00:00:00Z'),
    book('b', 'B（古い）', '2023-01-01T00:00:00Z'),
    { ...book('a', 'B'), id: 'c' },
    book('d', 'D')
  ], sequentialIds());
  assert.equal(plan.updated, 1);
  assert.equal(plan.unchanged, 1);
  assert.equal(plan.duplicates, 1);
  assert.equal(plan.added, 1);
  assert.deepEqual(plan.next.map(ref => ref.title), ['A（直した）', 'B', 'D']);
});

test('取り込み：同じファイルの中で同じIDが使われていても、両方とも取り込む', () => {
  const plan = planImport([], [book('x', 'X'), book('x', 'Y')], sequentialIds());
  assert.deepEqual(plan.next.map(ref => ref.title), ['X', 'Y']);
  assert.notEqual(plan.next[0].id, plan.next[1].id);
});

test('取り込み：種類のないデータや知らない種類は取り込まず、数を返す', () => {
  const plan = planImport([], [{ id: 'a', title: '種類なし' }, { id: 'b', type: 'unknown' }, 5, null], sequentialIds());
  assert.equal(plan.added, 0);
  assert.equal(plan.invalid, 4);
});

test('形の崩れたデータも、画面が落ちない形にそろえる', () => {
  const sanitized = sanitizeReference({ id: 3, type: 'japanese-book', authors: '佐藤', publisher: { name: 'x' }, year: '1999' });
  assert.deepEqual(sanitized.authors, [{ lastName: '佐藤', firstName: '', reading: '' }]);
  assert.equal(sanitized.id, '3');
  assert.equal('publisher' in sanitized, false);
  assert.equal(validateAndCleanData([sanitized]).cleaned[0].year, 1999);
});

test('元に戻す：変えた文献だけを戻し、そのあとに増えた文献は残す', () => {
  const before = [book('a', 'A'), book('b', 'B')];
  const after = [{ ...before[0], title: 'A2' }, book('c', 'C')];
  const undo = createUndo(before, after);
  const addedLater = book('z', 'Z');
  assert.deepEqual(undo([...after, addedLater]).map(ref => ref.title), ['A', 'B', 'Z']);
});

test('元に戻す：削除した文献を元の位置に戻す', () => {
  const before = [book('a', 'A'), book('b', 'B'), book('c', 'C')];
  const undo = createUndo(before, [before[0], before[2]]);
  assert.deepEqual(undo([before[0], before[2]]).map(ref => ref.id), ['a', 'b', 'c']);
});

test('二重登録の整理：参考文献一覧で同じ行になる文献を、先のものだけ残す', () => {
  const refs = [book('a', 'A'), { ...book('a', 'A'), id: 'a2' }, book('b', 'B')];
  assert.deepEqual(removeContentDuplicates(refs).map(ref => ref.id), ['a', 'b']);
});
