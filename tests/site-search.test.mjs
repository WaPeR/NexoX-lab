import test from 'node:test';
import assert from 'node:assert/strict';
import { filterSearchEntries, getSearchState, normalizeSearch } from '../src/lib/site-search.js';
import { getNewsPage, newsPagePath } from '../src/lib/news-pagination.js';

const entries = [
  { title: 'Acción y terror', description: 'Análisis cooperativo', type: 'reviews', platforms: ['PC'] },
  { title: 'Nuevo tráiler', description: 'Acción cooperativa', type: 'noticias', platforms: ['PC', 'PlayStation 5'] },
  { title: 'Aventura', description: 'Exploración', type: 'reviews', platforms: ['Nintendo Switch'] },
  { title: 'Secreto', description: 'Acción', type: 'noticias', platforms: ['PC'], draft: true }
];

test('normaliza tildes, mayúsculas y espacios', () => {
  assert.equal(normalizeSearch('  ACCIÓN   ÉPICA  '), 'accion epica');
});
test('busca en título y resumen sin distinguir tildes', () => {
  assert.equal(filterSearchEntries(entries, 'ACCION').length, 2);
  assert.equal(filterSearchEntries(entries, 'analisis').length, 1);
});
test('exige todas las palabras, combinando título y resumen', () => {
  assert.equal(filterSearchEntries(entries, 'terror cooperativo').length, 1);
  assert.equal(filterSearchEntries(entries, 'terror aventura').length, 0);
});
test('combina tipo y plataforma', () => {
  const result = filterSearchEntries(entries, 'accion', 'PC', 'noticias');
  assert.equal(result.length, 1);
  assert.equal(result[0].title, 'Nuevo tráiler');
  assert.equal(filterSearchEntries(entries, '', 'PlayStation 5', 'reviews').length, 0);
});
test('Todo incluye ambos tipos pero nunca borradores', () => {
  assert.equal(filterSearchEntries(entries).length, 3);
  assert.equal(filterSearchEntries(entries, '', '', 'valor-no-valido').length, 3);
});
test('pagina a seis resultados y limita páginas inválidas', () => {
  const many = Array.from({ length: 13 }, (_, id) => ({ ...entries[0], id }));
  assert.equal(getSearchState(many, 1).items.length, 6);
  assert.equal(getSearchState(many, 2).items[0].id, 6);
  assert.equal(getSearchState(many, 99).page, 3);
  assert.equal(getSearchState(many, -1).page, 1);
  assert.equal(getSearchState(many, NaN).page, 1);
});
test('cero coincidencias es una página vacía válida', () => {
  const state = getSearchState(entries, 8, 'inexistente');
  assert.equal(state.total, 0);
  assert.equal(state.totalPages, 1);
  assert.equal(state.page, 1);
  assert.deepEqual(state.items, []);
});
test('paginación de noticias conserva rutas y tamaño', () => {
  assert.equal(newsPagePath(1), '/noticias/');
  assert.equal(newsPagePath(2), '/noticias/pagina/2/');
  assert.equal(getNewsPage(Array.from({ length: 7 }), 2).items.length, 1);
  assert.equal(getNewsPage([], 2).page, 1);
});
