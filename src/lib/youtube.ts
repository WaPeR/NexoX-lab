const validId = /^[A-Za-z0-9_-]{11}$/;
const youtubeHosts = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com']);

export function getYouTubeId(value?: string | null): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase();
    const segments = url.pathname.split('/').filter(Boolean);
    let id: string | null = null;
    if (host === 'youtu.be' || host === 'www.youtu.be') {
      if (segments.length === 1) id = segments[0];
    } else if (youtubeHosts.has(host)) {
      if (url.pathname === '/watch' || url.pathname === '/watch/') {
        id = url.searchParams.get('v');
      } else if (segments.length === 2 && ['embed', 'shorts', 'live'].includes(segments[0])) {
        id = segments[1];
      }
    }
    return id && validId.test(id) ? id : null;
  } catch {
    return null;
  }
}
