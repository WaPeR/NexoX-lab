import test from 'node:test';
import assert from 'node:assert/strict';
import { getSectionArchive, sectionPagePath } from '../src/lib/section-archive.js';

test('las tres secciones comparten títulos y rutas consistentes', () => {
  for (const type of ['reviews', 'previews', 'noticias']) {
    const section = getSectionArchive(type);
    assert.equal(sectionPagePath(type), `/${type}/`);
    assert.equal(sectionPagePath(type, 2), `/${type}/pagina/2/`);
    assert.equal(section.latest, `Últimas ${section.label.toLowerCase()}`);
    assert.ok(section.description);
    assert.ok(section.empty.includes(section.label.toLowerCase()));
    assert.ok(section.listId.endsWith('-list'));
  }
});
test('preserva los anclajes existentes de Previews y Noticias', () => {
  assert.equal(getSectionArchive('previews').listId, 'previews-list');
  assert.equal(getSectionArchive('noticias').listId, 'news-list');
});
test('normaliza números de página y rechaza secciones desconocidas', () => {
  for (const page of [0, -1, NaN, Infinity]) assert.equal(sectionPagePath('reviews', page), '/reviews/');
  assert.equal(sectionPagePath('reviews', 2.9), '/reviews/pagina/2/');
  assert.throws(() => getSectionArchive('otra'));
  assert.throws(() => sectionPagePath('otra', 2));
});
