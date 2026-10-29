from pathlib import Path, PurePosixPath
import io
import json
import tarfile
import urllib.request

SOURCE = "536c51873e50bf21c4ee9dc41d3fb2d33a0da481"
ROOT = Path.cwd()
if (ROOT / "package.json").exists():
    raise SystemExit("La copia ya existe; no se sobrescribe.")
url = f"https://codeload.github.com/WaPeR/NexoX/tar.gz/{SOURCE}"
with urllib.request.urlopen(url, timeout=60) as response:
    archive = response.read(20_000_001)
if len(archive) > 20_000_000:
    raise RuntimeError("Archivo de origen demasiado grande")
with tarfile.open(fileobj=io.BytesIO(archive), mode="r:gz") as tar:
    total = 0
    for member in tar.getmembers():
        parts = PurePosixPath(member.name).parts[1:]
        if not parts or ".." in parts or member.issym() or member.islnk():
            continue
        rel = PurePosixPath(*parts)
        allowed = str(rel) in {".gitignore", "package.json", "astro.config.mjs"} or parts[0] in {"src", "public"}
        if not allowed or not member.isfile():
            continue
        total += member.size
        if total > 50_000_000:
            raise RuntimeError("Contenido de origen demasiado grande")
        target = ROOT.joinpath(*parts)
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(tar.extractfile(member).read())

def replace(path, old, new):
    file = ROOT / path
    text = file.read_text(encoding="utf-8")
    if text.count(old) != 1:
        raise RuntimeError(f"Patrón inesperado en {path}: {old}")
    file.write_text(text.replace(old, new, 1), encoding="utf-8")

(ROOT / "astro.config.mjs").write_text("import { defineConfig } from 'astro/config';\nexport default defineConfig({ site: 'https://waper.github.io', base: '/NexoX-lab', output: 'static', trailingSlash: 'always' });\n", encoding="utf-8")
(ROOT / "src/lib").mkdir(parents=True, exist_ok=True)
(ROOT / "src/lib/paths.ts").write_text(r"""const base = import.meta.env.BASE_URL.replace(/\/$/, '');
export function withBase(value: string): string {
  if (!value || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#|\?)/i.test(value)) return value;
  if (value === base || value.startsWith(base + '/')) return value;
  return base + '/' + value.replace(/^\/+/, '');
}
""", encoding="utf-8")
replace("src/layouts/Layout.astro", "---\nconst {", "---\nimport { withBase } from '../lib/paths';\nconst {")
replace("src/layouts/Layout.astro", '<meta name="color-scheme" content="dark" />', '<meta name="color-scheme" content="dark" />\n    <meta name="robots" content="noindex,follow" />')
replace("src/layouts/Layout.astro", 'href="/favicon.png"', "href={withBase('/favicon.png')}")
replace("src/layouts/Layout.astro", "new URL('/rss.xml', Astro.site)", "new URL(withBase('/rss.xml'), Astro.site)")
file = ROOT / "src/layouts/Layout.astro"
text = file.read_text(encoding="utf-8")
if text.count('href="/"') != 2:
    raise RuntimeError("Enlaces de inicio inesperados")
file.write_text(text.replace('href="/"', "href={withBase('/')}"), encoding="utf-8")
replace("src/layouts/Layout.astro", 'href="/rss.xml"', "href={withBase('/rss.xml')}")
replace("src/pages/index.astro", "import Layout from '../layouts/Layout.astro';", "import Layout from '../layouts/Layout.astro';\nimport { withBase } from '../lib/paths';")
replace("src/pages/index.astro", 'href={`/reviews/${id}/`}', 'href={withBase(`/reviews/${id}/`)}')
replace("src/pages/index.astro", 'src={data.image}', 'src={withBase(data.image)}')
replace("src/pages/reviews/[...slug].astro", "import Layout from '../../layouts/Layout.astro';", "import Layout from '../../layouts/Layout.astro';\nimport { withBase } from '../../lib/paths';")
replace("src/pages/reviews/[...slug].astro", 'href="/"', "href={withBase('/')}")
replace("src/pages/reviews/[...slug].astro", 'src={data.image}', 'src={withBase(data.image)}')
replace("src/pages/rss.xml.js", "import rss from '@astrojs/rss';", "import rss from '@astrojs/rss';\nimport { withBase } from '../lib/paths';")
replace("src/pages/rss.xml.js", 'link: `/reviews/${id}/`', 'link: withBase(`/reviews/${id}/`)')
replace("public/admin/config.yml", 'repo: WaPeR/NexoX\n', 'repo: WaPeR/NexoX-lab\n')
replace("public/admin/config.yml", '  branch: main\n', '  branch: main\n  base_url: https://oauth-pendiente.invalid\n  auth_endpoint: auth\n')
replace("public/admin/config.yml", 'public_folder: /images/uploads', 'public_folder: /NexoX-lab/images/uploads')
for file in (ROOT / "src/content/reviews").glob("*.md"):
    text = file.read_text(encoding="utf-8")
    file.write_text(text.replace('/images/uploads/', '/NexoX-lab/images/uploads/'), encoding="utf-8")
(ROOT / "public/admin/index.html").write_text("""<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Administración | NexoX-lab</title></head>
<body>
<p id="status" role="status">Comprobando la configuración del editor...</p>
<script type="module">
const status = document.getElementById('status');
try {
  const response = await fetch(new URL('./config.yml', window.location.href), { cache: 'no-store' });
  if (!response.ok) throw new Error('No se pudo cargar config.yml');
  const config = await response.text();
  if (config.includes('oauth-pendiente.invalid')) {
    status.textContent = 'NexoX-lab: falta conectar Cloudflare Workers. El editor permanecerá desactivado hasta configurar OAuth.';
  } else {
    status.remove();
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js';
    document.body.appendChild(script);
  }
} catch (error) {
  status.textContent = 'No se pudo iniciar el editor. Revisa su configuración.';
}
</script>
</body>
</html>
""", encoding="utf-8")
(ROOT / "SOURCE.json").write_text(json.dumps({"repository": "WaPeR/NexoX", "commit": SOURCE, "mode": "one-time-copy", "destination": "WaPeR/NexoX-lab"}, indent=2) + "\n", encoding="utf-8")
