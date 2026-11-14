import { getContentType } from './content-types.js';

const descriptions = {
  reviews: 'Reviews para descubrir videojuegos y encontrar tu próxima aventura.',
  previews: 'Primeras impresiones de los juegos que estamos descubriendo.',
  noticias: 'Anuncios, novedades y próximos mundos por descubrir.'
};

export function getSectionArchive(type) {
  const section = getContentType(type);
  const plural = section.label.toLowerCase();
  return { ...section, description: descriptions[type], latest: `Últimas ${plural}`, empty: `Todavía no hay ${plural} publicadas. Vuelve pronto.`, listId: `${section.collection}-list` };
}

export function sectionPagePath(type, requestedPage = 1) {
  const section = getContentType(type);
  const number = Math.floor(Number(requestedPage));
  const page = Number.isFinite(number) ? Math.max(1, number) : 1;
  return page === 1 ? section.path : `${section.path}pagina/${page}/`;
}
