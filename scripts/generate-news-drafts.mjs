import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const FEED_URL = 'https://gamebeeper.gg/feed.json';
const NEWS_DIR = path.resolve('src/content/news');
const PROCESSED_FILE = path.resolve('scripts/processed-news.json');
const MAX_DRAFTS = 10;

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function escapeYaml(value) {
  return String(value ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, ' ');
}

function cleanText(value) {
  return String(value ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function buildDescription(item) {
  const text = cleanText(item.summary || item.description || item.content || item.title);
  return text.length > 220 ? `${text.slice(0, 217)}...` : text;
}

function buildBody(item) {
  const summary = buildDescription(item);
  return `${summary}\n\n**Fuente original:** [${escapeYaml(item.sourceName || 'GameBeeper')}](${item.url})\n`;
}

function toIsoDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

async function loadProcessedUrls() {
  if (!existsSync(PROCESSED_FILE)) {
    return new Set();
  }
  const data = JSON.parse(await readFile(PROCESSED_FILE, 'utf8'));
  return new Set(data.processedUrls || []);
}

async function saveProcessedUrls(urls) {
  await writeFile(
    PROCESSED_FILE,
    `${JSON.stringify({ processedUrls: [...urls].sort() }, null, 2)}\n`,
    'utf8'
  );
}

async function main() {
  const response = await fetch(FEED_URL, {
    headers: { 'User-Agent': 'NexoX-news-drafts/1.0' }
  });

  if (!response.ok) {
    throw new Error(`No se pudo leer GameBeeper: HTTP ${response.status}`);
  }

  const feed = await response.json();
  const items = Array.isArray(feed.items) ? feed.items : [];
  const processedUrls = await loadProcessedUrls();
  const newUrls = [];
  let created = 0;

  await mkdir(NEWS_DIR, { recursive: true });

  for (const item of items) {
    if (created >= MAX_DRAFTS) break;

    const url = item.url || item.link || item.external_url;
    if (!url || processedUrls.has(url) || newUrls.includes(url)) continue;

    const title = cleanText(item.title);
    if (!title) continue;

    const slug = slugify(title);
    if (!slug) continue;

    const date = toIsoDate(item.date_published || item.date_modified || item.published || item.updated);
    const sourceName = cleanText(item.source || item.author?.name || 'GameBeeper');
    const description = buildDescription(item);
    const body = buildBody(item);

    const markdown = `---\ntitle: "${escapeYaml(title)}"\ndescription: "${escapeYaml(description)}"\ndate: ${date}\nfeatured: false\nimage: ""\nimageAlt: ""\nplatforms: []\nsourceName: "${escapeYaml(sourceName)}"\nsourceUrl: "${escapeYaml(url)}"\nyoutube: ""\ndraft: true\n---\n\n${body}`;

    await writeFile(path.join(NEWS_DIR, `${slug}.md`), markdown, 'utf8');
    newUrls.push(url);
    created += 1;
  }

  if (newUrls.length > 0) {
    for (const url of newUrls) processedUrls.add(url);
    await saveProcessedUrls(processedUrls);
  }

  console.log(`Borradores creados: ${created}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
