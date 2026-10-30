const legacyBase = '/NexoX-lab';
export function withBase(value: string): string {
  if (!value) return value;
  if (value === legacyBase) return '/';
  if (value.startsWith(legacyBase + '/')) return value.slice(legacyBase.length);
  if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\?)/i.test(value)) return value;
  return '/' + value.replace(/^\/+/, '');
}
