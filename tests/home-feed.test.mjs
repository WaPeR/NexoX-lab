import test from 'node:test';
import assert from 'node:assert/strict';
import { getHomeFeed, HOME_PAGE_SIZE } from '../src/lib/home-feed.js';
const item = (id, date, featured = false, type = 'reviews', draft = false) => ({ type, entry: { id, data: { date: new Date(date), featured, draft } } });
test('no featured article unless explicitly selected', () => {
  const feed = getHomeFeed([item('a', '2026-01-01')]);
  assert.equal(feed.featured, undefined);
  assert.equal(feed.items.length, 1);
});
test('newest marked publication wins across categories', () => {
  const feed = getHomeFeed([item('old', '2026-01-01', true), item('news', '2026-01-02', true, 'noticias'), item('unmarked', '2026-01-03')]);
  assert.equal(feed.featured.entry.id, 'news');
  assert.deepEqual(feed.items.map(({ entry }) => entry.id), ['unmarked', 'old']);
});
test('drafts never appear or become featured', () => {
  const feed = getHomeFeed([item('draft', '2026-01-03', true, 'noticias', true), item('published', '2026-01-01')]);
  assert.equal(feed.featured, undefined);
  assert.equal(feed.total, 1);
});
test('one featured plus six cards does not create an empty second page', () => {
  const entries = Array.from({ length: 7 }, (_, index) => item(String(index), `2026-01-0${index + 1}`, index === 0));
  const feed = getHomeFeed(entries);
  assert.equal(HOME_PAGE_SIZE, 6);
  assert.equal(feed.items.length, 6);
  assert.equal(feed.totalPages, 1);
  assert.equal(new Set([feed.featured, ...feed.items]).size, 7);
});
test('remaining articles continue on subsequent pages', () => {
  const entries = Array.from({ length: 8 }, (_, index) => item(String(index), `2026-01-0${index + 1}`, index === 0));
  const feed = getHomeFeed(entries);
  assert.equal(feed.totalPages, 2);
  assert.equal(feed.items.slice(0, 6).length, 6);
  assert.equal(feed.items.slice(6).length, 1);
});
test('empty archive still has a valid first page', () => {
  assert.deepEqual(getHomeFeed([]), { featured: undefined, items: [], total: 0, totalPages: 1 });
});
