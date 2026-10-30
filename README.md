# NexoX

Blog de videojuegos con Astro, Decap CMS y GitHub Pages.

- Web: https://nexox.eu/
- Editor: https://nexox.eu/admin/
- RSS: https://nexox.eu/rss.xml
- Repositorio activo: WaPeR/NexoX-lab, rama main. El nombre interno no cambia el nombre público del blog.

## Publicación

Decap guarda los cambios en este repositorio y el flujo Publicar NexoX construye y publica la web. El flujo no importa contenido del original ni tiene permiso de escritura sobre los archivos del repositorio.

Instalación local: npm ci. Desarrollo: npm run dev. Construcción: npm run build.

En Settings > Pages deben estar seleccionados GitHub Actions y el dominio nexox.eu. Activar Enforce HTTPS cuando el certificado esté disponible. Los DNS y la verificación del dominio se gestionan aparte del código.

## Rutas e imágenes

La web se publica en la raíz del dominio, sin base /NexoX-lab/. Las imágenes nuevas se guardan en public/images/uploads y se publican como /images/uploads.

La función withBase normaliza las rutas antiguas de las portadas. Para conservar las imágenes referenciadas por artículos existentes y las previsualizaciones del editor sin reescribir los textos, el despliegue también publica una copia de dist/images bajo /NexoX-lab/images. Esta compatibilidad duplica los recursos gráficos en el artefacto publicado, no en el repositorio. No es una redirección de páginas antiguas.

## OAuth

Decap conserva el Worker https://nexox-lab-oauth.nexox.workers.dev, con auth_endpoint: auth.

Redirect URI de la aplicación OAuth: https://nexox-lab-oauth.nexox.workers.dev/callback?provider=github

GITHUB_OAUTH_ID y GITHUB_OAUTH_SECRET se configuran en Cloudflare; nunca en el repositorio. Comprobar el inicio de sesión desde el dominio nuevo después de desplegar.

## Conservación del original

WaPeR/NexoX y Netlify no se modifican ni se sincronizan con este repositorio. SOURCE.json y scripts/bootstrap.py se conservan como referencia histórica de la importación inicial; el flujo de producción ya no ejecuta el importador.

Las páginas públicas no incluyen el noindex de pruebas. El panel de administración mantiene noindex,nofollow. Esto no es control de acceso: los borradores almacenados en el repositorio público siguen siendo consultables en GitHub.

## Validación del lanzamiento

Comprobar Actions, HTTPS, portada, artículos, imágenes antiguas y nuevas, vídeos, favicon, RSS e inicio de sesión y publicación desde Decap. La presencia de estos archivos no confirma por sí sola un despliegue correcto.
