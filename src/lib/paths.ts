const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export function withBase(value: string): string {
  if (!value || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\?)/i.test(value)) return value;
  if (value === base || value.startsWith(base + '/')) return value;
  return base + '/' + value.replace(/^\/+/, '');
}
