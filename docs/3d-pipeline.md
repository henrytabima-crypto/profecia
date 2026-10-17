# Pipeline de activos 3D

Fecha de última generación: 2026-08-24.

## Decisión técnica

Los primeros GLB publicados se generaron desde tres imágenes de referencia con
[Tripo AI](https://www.tripo3d.ai/) mediante el CLI oficial y el modelo
`tripo-v3.1`. Cada resultado se redujo con un objetivo de 10 000 caras y luego
se optimizó localmente para web: texturas de hasta 1024 px, PBR embebido y sin
dependencias de decodificadores externos. Las imágenes sintéticas de referencia
sí se enviaron al servicio de Tripo para realizar la reconstrucción.

Alternativas evaluadas:

- [Pixal3D](https://github.com/TencentARC/Pixal3D): MIT, alta fidelidad y PBR;
  su ejecución local está orientada a NVIDIA/CUDA.
- [TRELLIS.2](https://github.com/microsoft/TRELLIS.2): MIT, GLB PBR y Space
  oficial gratuito; la ejecución local recomendada requiere 24 GB de VRAM
  NVIDIA.
- [Stable Fast 3D](https://github.com/Stability-AI/stable-fast-3d): rápido,
  PBR y aproximadamente 6 GB de VRAM; su licencia comunitaria es gratuita
  para organizaciones con menos de USD 1 millón de ingresos anuales.
- [TripoSR](https://github.com/VAST-AI-Research/TripoSR): MIT, ligero y apto
  para generación local; se usó para el primer prototipo.
- [Tripo AI](https://www.tripo3d.ai/): servicio alojado con CLI y API; fue la
  opción final por su mayor fidelidad visual y las credenciales ya disponibles.

La mención de Tripo AI identifica la herramienta de generación; no atribuye a
los activos una licencia MIT.

## Archivos

- `public/3d-sources/daniel-statue-source-v1.png`: referencia original de la
  estatua.
- `public/models/daniel-statue-tripo-v31-v1.glb`: 15 387 vértices, 13 856
  triángulos, 1 259 552 bytes.
- `public/3d-sources/daniel-boulder-source-v1.png`: referencia original de la
  piedra de Daniel 2.
- `public/models/daniel-boulder-tripo-v31-v1.glb`: 16 222 vértices, 16 111
  triángulos, 1 242 532 bytes.
- `public/3d-sources/sanctuary-diorama-source-v1.png`: referencia original del
  santuario.
- El GLB monolítico del santuario (18 612 vértices, 12 701 triángulos) se retiró
  de `public/models`; la imagen fuente queda como registro del prototipo.
- `public/3d-sources/sanctuary-courtyard-panel-source-v1.png` y su GLB: módulo
  repetible de lino con un poste lateral.
- `public/3d-sources/sanctuary-entrance-gate-source-v1.png` y su GLB: entrada
  oriental de cuatro postes.
- `public/3d-sources/sanctuary-tabernacle-cutaway-source-v1.png` y su GLB:
  tienda vacía recortada, con tablas, velo y cubiertas recogidas.
- `scripts/generate_3d_asset_local.py`: reproductor local del pipeline.

Las cinco zonas de la estatua y la piedra comparten el mismo indicador de
selección: una caja de alambre dorada. En la piedra, la caja se calcula desde
su `Box3` normalizado, recibe un margen mínimo y solo se renderiza mientras esa
estación está activa, de modo que no agrega una superficie invisible al
raycast cuando no está seleccionada.

## Prompts de ImageGen

Cada referencia fue generada por separado con OpenAI ImageGen.

### Estatua de Daniel 2

```text
Use case: stylized-concept
Asset type: production source image for single-image-to-3D reconstruction
Primary request: create one complete monumental statue inspired by the sequence in Daniel chapter 2, designed as a clean, coherent 3D asset reference
Scene/backdrop: genuinely transparent background, no floor, no pedestal, no environment
Subject: a single anonymous human statue with dignified ancient monumental proportions, standing straight in a neutral symmetrical pose with arms relaxed close to the sides; the head and neck are polished warm gold; the chest, shoulders and both complete arms are brushed silver; the abdomen, hips and upper thighs are aged bronze; both lower legs are dark forged iron; both feet visibly combine interlocking iron and terracotta clay sections; all material transitions are crisp and anatomically aligned
Style/medium: high-end realistic PBR 3D product render, historically neutral, museum-quality digital sculpture, strong clean silhouette
Composition/framing: full body entirely visible with generous margin, centered, three-quarter front view showing the front and one side, near-orthographic 50mm product camera, upright vertical asset
Lighting/mood: large soft studio lights that reveal shape and material without dramatic shadows
Materials/textures: physically plausible gold, silver, bronze, iron and matte fired clay; subtle age and surface grain, not damaged
Constraints: exactly one connected statue; no stone, no weapons, no crown, no clothing, no pedestal, no labels, no writing, no symbols, no extra objects; preserve clear material zones; transparent alpha background
Avoid: photoreal human skin, exposed anatomy, nudity detail, text, watermark, halo, fantasy armor, theatrical scenery, cropped limbs
```

### Piedra de Daniel 2

```text
Use case: stylized-concept
Asset type: production source image for single-image-to-3D reconstruction in an interactive educational website
Primary request: create one monumental natural boulder representing the stone “cut without hands” in Daniel 2, designed as a clean coherent 3D reconstruction reference
Scene/backdrop: genuinely transparent background; no floor, no pedestal, no environment, no cast shadow detached from the object
Subject: exactly one complete irregular ancient mountain boulder, roughly rounded but asymmetrical, weighty and stable, with a broad lower mass and several believable fractured planes; it must read as an unworked natural stone rather than a carved sphere
Style/medium: high-end realistic PBR 3D product render, museum-quality digital asset, strong readable low-poly-compatible silhouette
Composition/framing: object entirely visible with generous margin, centered, elevated three-quarter front view showing top, front, and one side, near-orthographic 50mm product camera
Lighting/mood: large soft neutral studio lights revealing volume and surface without dramatic shadows
Color palette: warm gray limestone with restrained sand, taupe, charcoal, and cool-gray variation
Materials/textures: dense weathered stone; fine granular pores, shallow erosion, hairline mineral seams, chipped angular edges; subtle age, not ruined
Constraints: exactly one connected boulder; opaque stone; genuine transparent alpha background; no writing, no symbols, no labels, no vegetation, no dust cloud, no people, no statue fragments, no extra rocks
Avoid: polished marble, gemstone, meteorite, floating island, fantasy crystal, perfectly round sphere, deep caves, holes through the object, watermark, cropped edges
```

### Santuario

```text
Use case: scientific-educational
Asset type: production source image for single-image-to-3D reconstruction
Primary request: create a single coherent architectural scale model of the biblical wilderness sanctuary described in Exodus 25–30, shown as an open cutaway educational diorama
Scene/backdrop: genuinely transparent background, no landscape, no floor plane, no desert scenery
Subject: one rectangular sanctuary complex with a 2:1 outer courtyard enclosed by low white linen curtains on evenly spaced bronze-and-silver posts; a centered eastern entrance curtain in blue, purple and scarlet; inside, a square bronze altar followed by a round bronze laver on the central axis; at the western end, a roofless rectangular tabernacle with the near wall lowered so both rooms are readable; the larger Holy Place contains a golden seven-branched lampstand, a small golden table with bread, and a compact golden incense altar; a richly colored veil separates the smaller Most Holy Place containing one golden ark with two simple facing cherubim
Style/medium: high-end realistic PBR 3D architectural model, museum educational reconstruction, coherent handcrafted diorama, historically informed but visually simplified for clarity
Composition/framing: entire complex fully visible with generous margin, centered, elevated three-quarter isometric view from the entrance toward the western end, long axis receding into depth, near-orthographic camera, strong clean silhouette
Lighting/mood: soft neutral studio lighting that reveals geometry evenly, no dramatic cast shadows
Materials/textures: woven white linen, weathered acacia wood, bronze, gold, restrained blue-purple-scarlet fabric, sandy courtyard surface contained inside the model
Constraints: exactly one complete sanctuary diorama; no people, no animals, no cloud, no fire, no surrounding terrain, no tents, no labels, no writing, no modern objects; all five teaching stations must remain distinguishable; transparent alpha background
Avoid: cinematic desert scene, fantasy temple, Christian church architecture, domes, stone columns, pyramids, text, watermark, cropped perimeter, hidden interior
```

### Módulos del entorno del santuario

Estos son los prompts finales normalizados usados para las tres referencias
arquitectónicas que sustituyen el antiguo entorno geométrico.

#### Paño repetible del atrio

```text
Use case: scientific-educational
Asset type: production source image for single-image-to-3D reconstruction; repeatable architectural module for an interactive biblical sanctuary
Primary request: create one complete modular bay of the wilderness tabernacle courtyard described in Exodus 27, suitable for repetition along a measured perimeter
Scene/backdrop: genuinely transparent background, no floor, no landscape, no cast shadow detached from the object
Subject: exactly one slender courtyard post at the far left, seated in a weighty bronze socket and fitted with restrained silver bands and hooks; one white finely woven linen hanging begins at that post and extends horizontally to a clean free edge on the right; soft believable folds, lower hem level, historically neutral construction
Style/medium: high-end realistic PBR 3D product render, museum reconstruction, clean low-poly-compatible silhouette
Composition/framing: entire module fully visible with generous margin, straight-on with a very slight elevated three-quarter angle, near-orthographic product camera
Lighting/mood: soft neutral studio lighting revealing the weave, metal and post shape evenly
Constraints: exactly one post; exactly one connected linen span; no second post; no entrance colors; no ropes crossing the cloth; no labels, writing, people or extra objects
Avoid: full courtyard, modern fence, stone columns, fantasy ornament, torn fabric, watermark, cropped post or cloth
```

#### Entrada oriental

```text
Use case: scientific-educational
Asset type: production source image for single-image-to-3D reconstruction; complete eastern entrance module for an interactive biblical sanctuary
Primary request: create the complete twenty-cubit entrance screen of the wilderness tabernacle courtyard described in Exodus 27:13–16
Scene/backdrop: genuinely transparent background, no floor, no surrounding courtyard, no scenery
Subject: one coherent freestanding entrance made with exactly four evenly spaced slender posts in bronze sockets with restrained silver fittings; finely woven hanging embroidered in clearly readable blue, purple, scarlet and white linen; believable folds and a level lower edge; no rigid door leaves
Style/medium: high-end realistic PBR 3D product render, museum-quality biblical architectural reconstruction, strong readable silhouette
Composition/framing: entire wide entrance fully visible with generous margin, centered, straight-on with a slight elevated three-quarter view, near-orthographic product camera
Lighting/mood: broad soft neutral studio lighting
Constraints: exactly four posts; one complete twenty-cubit gate assembly; no additional white perimeter panels; no people, symbols, labels, writing or extra objects
Avoid: palace gate, stone arch, church doorway, modern fabric, excessive ornament, watermark, cropped posts
```

#### Tienda recortada

```text
Use case: scientific-educational
Asset type: production source image for single-image-to-3D reconstruction; empty cutaway shell for a measured interactive assembly
Primary request: create one empty architectural reconstruction of the wilderness tabernacle tent described in Exodus 26, with the customary didactic volume of 30 by 10 by 10 cubits
Scene/backdrop: plain neutral seamless studio background, no desert, no ground plane extending beyond the asset
Subject: a long rectangular tabernacle shell with its near long side completely open as a museum cutaway; gold-covered upright boards and silver sockets; eastern entrance at the front; solid western rear wall; one richly woven blue-purple-scarlet inner veil placed two thirds of the way from the entrance, dividing the Holy Place from the Most Holy Place; layered woven and dark protective coverings rolled neatly over the far roof edge so the rooms remain visible
Style/medium: high-end realistic PBR 3D architectural reconstruction, handcrafted museum model, historically informed and restrained
Composition/framing: full building entirely visible, elevated three-quarter view from the open side and eastern entrance, long axis receding into depth, near-orthographic camera
Lighting/mood: soft even studio light that keeps both rooms readable
Constraints: empty interior; no altar, laver, table, lampstand, incense altar, ark or other furniture; no people; no text; no symbols on the exterior entrance curtain; preserve a clean rectangular 30:10:10 proportion and an unobstructed cutaway side
Avoid: complete closed tent, fantasy temple, stone architecture, church imagery, winged emblem on the outer curtain, surrounding courtyard, watermark, cropped rear wall
```

La salida inicial de la tienda añadió un motivo alado en la cortina exterior.
Se corrigió con una única edición dirigida:

```text
Use case: precise-object-edit
Asset type: production source image for single-image-to-3D reconstruction
Primary request: remove only the winged or angel-like ornament from the outer entrance curtain and replace that small area with matching plain woven fabric
Input images: Image 1 is the edit target
Constraints: change only the unintended outer-curtain ornament; preserve the complete building, camera, proportions, lighting, open cutaway, gold boards, rolled coverings and the colored inner veil exactly; keep the inner veil design unchanged; add no furniture, text or new symbols
```

## Reproducción del pipeline final

La generación se ejecutó una vez por activo. El coste observado el 21 de agosto
de 2026 fue de 60 créditos por activo: 30 para `image_to_model` y 30 para
`highpoly_to_lowpoly`. Los precios del servicio pueden cambiar.

```bash
tripo make public/3d-sources/daniel-statue-source-v1.png \
  --for ar-web --then decimate:10000 --json --yes --no-open

tripo make public/3d-sources/daniel-boulder-source-v1.png \
  --for ar-web --then decimate:10000 --json --yes --no-open

tripo make public/3d-sources/sanctuary-diorama-source-v1.png \
  --for ar-web --then decimate:10000 --json --yes --no-open
```

Después se validaron los GLB con `glTF-Transform`, se redujeron las texturas a
1024 px y se recomprimieron a JPEG con calidad 88. Los archivos finales son
GLB 2.0 válidos; conservan una textura base, un mapa normal y un mapa combinado
de metal/aspereza. El script basado en TripoSR se mantiene como alternativa
local para pruebas sin enviar imágenes a un servicio externo.

La imagen fuente del antiguo santuario monolítico se conserva como registro del
prototipo, pero su GLB ya no se publica. La experiencia actual usa seis muebles
y tres módulos de entorno GLB dentro de una asamblea medida. La decisión,
dimensiones, fuentes, coordenadas e incertidumbres están documentadas en
[`sanctuary-assembly.md`](./sanctuary-assembly.md).

Como paso final, los 27 mapas PBR embebidos de esos nueve GLB se redujeron a
1024² con glTF-Transform 4.4.2. El conjunto publicado ocupa 6 958 424 bytes y
no requiere extensiones de compresión ni decodificadores externos. El panel del
atrio se simplificó además de 4 278 a 2 723 triángulos con un límite de error
del 1%; la aplicación lo instancia 56 veces en una sola llamada de dibujo.
