# Profecía Adventista

Experiencia educativa e interactiva para estudiar las profecías desde la
perspectiva adventista. El proyecto funciona con
[Next.js](https://nextjs.org/) e incluye reconstrucciones 3D, panoramas
interactivos y un glosario profético con referencias bíblicas y fuentes de
consulta.

## Prerequisites

- Node.js `>=22.13.0`

## Desarrollo local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` mientras el servidor esté activo.

## Recorrido guiado

Los ocho niveles comparten el recorrido móvil base: Mira → Escucha → Lee →
Practica → Tu premio. Los videos y podcasts disponibles se reproducen en YouTube.
La lectura de apoyo sigue disponible.
Todos los temas tienen enlaces definitivos de video introductorio y podcast.

Cada `docs/notebooklm/*/fuentes.json` registra los enlaces multimedia y su estado.
Los videos, audios y referencias visuales de producción se conservan en el
archivo local original, fuera de este repositorio. Git incluye las infografías,
modelos, texturas y la imagen de respaldo que necesita la aplicación.

El segundo tema añade Explora entre Lee y Practica. Mantiene sus lecturas y
permite recorrer las seis partes de la estatua 3D en una sola vista: cada selección
actualiza el detalle y guarda su check, sin cambiar de página ni mover el foco.
Continuar se habilita al explorar las seis partes. Practica incluye seis
parejas material–significado, clasificación de evidencias y preguntas finales.
En los dos primeros temas, Clasifica ofrece cuatro tarjetas y dos categorías
lado a lado: se pueden arrastrar o colocar tocando tarjeta y categoría.
Cada actividad exige acertar y pulsar Continuar. Las infografías de los ocho
temas se obtienen como premio y se amplían desde la galería.

`app/data/levels.ts` configura los niveles; el contenido original del primero
permanece en `app/data/firstLevel.ts`. Las demás misiones reutilizan sus lecturas
y preguntas existentes en el nuevo formato. Todas están disponibles desde el
mapa, con una ruta recomendada. Los logros previos conservan el acceso a los cinco
recursos: glosario, estatua, cronología, santuario y panoramas de Apocalipsis.

El progreso se guarda en este navegador. «Reiniciar aventura» permite empezar
de cero y «Explorar libremente», en Galería, permite explorar libremente.
El flujo, las claves de guardado y la compatibilidad están documentados en
[`docs/aventura-experimental.md`](docs/aventura-experimental.md).

El mundo ilustrado con ruta sinuosa, el progreso parcial y la accesibilidad
se documentan en [`docs/ux-expedicion.md`](docs/ux-expedicion.md).

## Validación

```bash
npm test
npm run lint
```

El proyecto está desacoplado de ChatGPT Sites. La versión de producción se
despliega mediante InsForge y el dominio canónico es
`profecia.henrytabimagiraldo.com`.

El pipeline de imágenes y modelos está documentado en
[`docs/3d-pipeline.md`](docs/3d-pipeline.md).

## Referencias técnicas

- [Next.js](https://nextjs.org/docs)
- [Three.js](https://threejs.org/)
