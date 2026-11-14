import test from 'node:test';
import assert from 'node:assert/strict';
import { CONTENT_TYPES, getContentType, contentPath } from '../src/lib/content-types.js';

test('Previews utiliza plural en sección y singular en artículos y enlaces', () => {
  assert.equal(getContentType('previews').label, 'Previews');
  assert.equal(getContentType('previews').singular, 'Preview');
  assert.equal(getContentType('previews').readLabel, 'Leer preview');
  assert.equal(getContentType('previews').collection, 'previews');
  assert.equal(contentPath('previews', 'un-juego'), '/previews/un-juego/');
});

test('conserva las rutas de reviews y noticias', () => {
  assert.equal(contentPath('reviews', 'un-juego'), '/reviews/un-juego/');
  assert.equal(contentPath('noticias', 'un-anuncio'), '/noticias/un-anuncio/');
  assert.equal(getContentType('noticias').collection, 'news');
  assert.equal(Object.isFrozen(CONTENT_TYPES), true);
});

test('rechaza tipos e identificadores inválidos', () => {
  assert.throws(() => getContentType('otro'));
  assert.throws(() => getContentType('constructor'));
  for (const id of ['', '../otro', '/otro', 'otro/', 'otro?x=1', 'otro#x', 'otro\\x']) {
    assert.throws(() => contentPath('previews', id));
  }
});
