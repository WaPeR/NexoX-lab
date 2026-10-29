# NexoX-lab

Copia de prueba independiente de NexoX: Astro, GitHub Pages y Decap CMS.

## Inicialización

El flujo `.github/workflows/pages.yml` importa una sola vez el código, las reviews y las imágenes de `WaPeR/NexoX`, fijado al commit `536c51873e50bf21c4ee9dc41d3fb2d33a0da481`. No copia el historial ni la configuración de Netlify, no escribe en el original y no mantiene sincronización posterior.

La importación crea un commit exclusivamente en este repositorio, incluyendo las imágenes binarias y un package-lock.json. Las ejecuciones posteriores no vuelven a importar ni sobrescriben los artículos de la copia. El origen queda registrado en SOURCE.json.

## Publicación

En este repositorio: Settings > Pages > Build and deployment > Source > GitHub Actions. El flujo se ejecuta al guardar en main o manualmente desde Actions. Si la primera ejecución falla por no estar habilitado Pages, actívalo y vuelve a ejecutarla.

Dirección prevista: https://waper.github.io/NexoX-lab/
Editor previsto: https://waper.github.io/NexoX-lab/admin/

No se considera publicado hasta comprobar que el flujo ha finalizado correctamente.

## Decap y Cloudflare Workers

El panel está desactivado mientras `public/admin/config.yml` contenga `https://oauth-pendiente.invalid`. No utiliza Netlify como autenticación alternativa.

Cuando se configure el servicio OAuth, sustituir solo `backend.base_url` por la dirección HTTPS real del Worker. `backend.auth_endpoint: auth` requiere que el Worker implemente esa ruta. Configurar también la aplicación OAuth de GitHub y su URL de retorno según el Worker elegido. No guardar Client Secret, tokens ni otras credenciales en este repositorio o en Decap: los secretos van en Cloudflare.

Decap apunta exclusivamente a `WaPeR/NexoX-lab`, rama main. Conserva los campos originales, incluido YouTube. Las imágenes nuevas usan `/NexoX-lab/images/uploads/`.

## Comprobaciones pendientes

- Construcción y despliegue correctos en Actions.
- Portada, reviews, imágenes, favicon, vídeos y RSS bajo /NexoX-lab/.
- Inicio de sesión, subida de imagen y publicación de una review desde Decap tras conectar OAuth.

El sitio incluye meta noindex para la prueba. No es control de acceso: el repositorio y la web son públicos, incluidos los archivos de borradores almacenados en GitHub.
