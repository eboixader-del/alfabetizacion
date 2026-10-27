# Mis Recursos de Aula

Web estática (GitHub Pages) con herramientas, cursos y actividades de IA de Infantil a Bachillerato, rúbricas de idoneidad y versión en castellano y valenciano: <https://eboixader-del.github.io/alfabetizacion/>

## Páginas

| Archivo | Contenido |
|---|---|
| `index.html` | Recursos, fichas, favoritos, novedades, recomendador y rúbricas (con informe PDF) |
| `codeorg.html` | Catálogo de cursos de Code.org |
| `raspberrypi.html` | Catálogo de proyectos de Raspberry Pi |
| `pensamiento-critico.html` | Actividades de pensamiento crítico |
| `verificacion-ia.html` | Actividades de verificación |

Archivos compartidos: `tema.css` y `tema.js` (modo oscuro y móvil), `i18n.js` (idioma), `lib/` (generador de QR y de PDF, ambos con licencia MIT), `data/` (datos del recomendador), `rubricas/` (PDF originales).

## Añadir un recurso

1. En `index.html`, añade un objeto a `RECURSOS` con `etapa`, `icon`, `nombre`, `alta` (fecha de hoy, AAAA-MM-DD), `idea`, `idioma` (`es`, `mix`, `en` o `sin`), `cat`, `edad`, `desc` y `links`. Con `alta`, el recurso aparece en «Novedades» y lleva la etiqueta NUEVO durante 60 días.
2. Añade su traducción en `i18n/index.va.js`, dentro de `VA.recursos`, con la clave del recurso (el nombre en minúsculas, sin tildes y con guiones; por ejemplo, `quick-draw`): `desc`, `idea` y, si hace falta, `nombre`. Si la categoría o el texto del enlace son nuevos, añádelos a `VA.ui`.
3. Si es un cambio visible de la web, apúntalo arriba en `NOVEDADES_WEB` (y en `VA.novedades`).

## Idioma

- El idioma se cambia con el botón ES/VAL o con `?lang=va` / `?lang=es` en la dirección.
- Los textos de la interfaz pasan por `tr('texto en castellano')`; su traducción está en `VA.ui` del archivo `i18n/<página>.va.js`. Los bloques con marcado llevan `data-i18n` y se traducen en `VA.html`.
- Si cambias `data/recomendador.json` o las traducciones de los catálogos o actividades, regenera el recomendador en valenciano:

  ```
  python3 tools/generar_recomendador_va.py
  ```

## Autoría y licencia

Web cocreada por **Ernest Boixader** y **Claude** (Anthropic).

El contenido propio (textos, selección y descripción de recursos, rúbricas y actividades) se comparte con licencia
[Creative Commons Reconocimiento-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es):
puedes copiarlo, compartirlo y adaptarlo citando la autoría, sin fines comerciales y con la misma licencia.

Los recursos y sitios enlazados conservan sus propias licencias. Las actividades de *Pensamiento crítico* y *Verificar lo que dice la IA*
son adaptaciones de Med Kharbach (educatorstechnology.com), indicadas en cada página. Las bibliotecas de `lib/`
(jsPDF y qrcode) tienen licencia MIT.
