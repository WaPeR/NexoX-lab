const types = Object.freeze({
  reviews: Object.freeze({ collection: 'reviews', label: 'Reviews', singular: 'Review', readLabel: 'Leer review', path: '/reviews/' }),
  previews: Object.freeze({ collection: 'previews', label: 'Previews', singular: 'Preview', readLabel: 'Leer preview', path: '/previews/' }),
  noticias: Object.freeze({ collection: 'news', label: 'Noticias', singular: 'Noticia', readLabel: 'Leer noticia', path: '/noticias/' })
});

export const CONTENT_TYPES = types;

export function getContentType(type) {
  if (!Object.hasOwn(types, type)) throw new Error(`Tipo de contenido desconocido: ${type}`);
  return types[type];
}

export function contentPath(type, id) {
  const section = getContentType(type);
  if (typeof id !== 'string' || !id || id.split('/').some(part => !part || part === '.' || part === '..') || /[?#\\]/.test(id)) {
    throw new Error('Identificador de contenido no válido.');
  }
  return `${section.path}${id}/`;
}
