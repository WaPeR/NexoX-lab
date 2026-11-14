import test from 'node:test';
import assert from 'node:assert/strict';
import { filterSearchEntries, getSearchState } from '../src/lib/site-search.js';

const entries = [
  { id: 'review', title: 'Aventura', description: 'Exploración', type: 'reviews', platforms: ['PC'] },
  { id: 'preview-pc', title: 'Aventura anticipada', description: 'Exploración', type: 'previews', platforms: ['PC'] },
  { id: 'preview-switch', title: 'Otra aventura', description: 'Demo', type: 'previews', platforms: ['Nintendo Switch 2'] },
  { id: 'news', title: 'Aventura anunciada', description: 'Noticia', type: 'noticias', platforms: ['PC'] },
  { id: 'draft', title: 'Aventura secreta', description: 'Demo', type: 'previews', platforms: ['PC'], draft: true }
];

test('el tipo previews no incluye reviews ni noticias ni borradores', () => {
  assert.deepEqual(filterSearchEntries(entries, '', '', 'previews').map(entry => entry.id), ['preview-pc', 'preview-switch']);
});
test('combina Previews con búsqueda y plataforma', () => {
  assert.deepEqual(filterSearchEntries(entries, 'AVENTURA', 'PC', 'previews').map(entry => entry.id), ['preview-pc']);
  assert.deepEqual(filterSearchEntries(entries, '', 'Nintendo Switch 2', 'previews').map(entry => entry.id), ['preview-switch']);
  assert.equal(filterSearchEntries(entries, '', 'PlayStation 5', 'previews').length, 0);
});
test('Todo incluye previews publicadas y conserva los otros tipos', () => {
  assert.equal(filterSearchEntries(entries).length, 4);
  assert.equal(filterSearchEntries(entries, '', '', 'reviews')[0].id, 'review');
  assert.equal(filterSearchEntries(entries, '', '', 'noticias')[0].id, 'news');
});
test('pagina previews sin mezclar otros tipos', () => {
  const many = Array.from({ length: 7 }, (_, id) => ({ ...entries[1], id: String(id) }));
  const state = getSearchState([...many, entries[0], entries[3]], 2, '', '', 'previews');
  assert.equal(state.total, 7);
  assert.equal(state.totalPages, 2);
  assert.equal(state.items.length, 1);
  assert.equal(state.items[0].id, '6');
});
