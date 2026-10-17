import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  return readFile(new URL("../.next/server/app/index.html", import.meta.url), "utf8");
}

async function projectContent() {
  return (await Promise.all(["page.tsx", "data/studies.ts", "data/statueExploration.ts", "components/FirstLevel.tsx", "components/ResourceViewer.tsx"].map((path) => readFile(new URL(`../app/${path}`, import.meta.url), "utf8")))).join("\n");
}

test("opens directly on the mission world with gallery and options access", async () => {
  const html = await render();
  assert.match(html, /<html[^>]*lang="es"/i);
  assert.match(html, /Profecía \| Atlas bíblico interactivo/i);
  assert.match(html, /Tu expedición: mapa de ocho misiones/);
  assert.match(html, /game-shell is-world/);
  assert.equal((html.match(/class="world-node"/g) ?? []).length, 8);
  assert.doesNotMatch(html, /game-welcome|welcome-title|Empezar aventura|Continuar aventura|<span>Inicio<\/span>/);
  assert.match(html, /Profecía, volver al mapa/);
  assert.match(html, /Opciones/);
  assert.match(html, /Galería/);
  assert.match(html, /Cargando tu progreso/);
  assert.match(html, /El gran conflicto/);
  assert.match(html, /og\.png/);
  for (const id of ["ruta", "explorar", "cronologia", "glosario", "metodo", "fuentes"]) {
    assert.ok(!html.includes(`id="${id}"`), `${id} should only mount when deliberately opened`);
  }
  assert.doesNotMatch(html, /OrbitControls|DanielStatue3D|Sanctuary3D|codex-preview|react-loading-skeleton/);
});

test("keeps the content transparent and source-led", async () => {
  const [page, layout, packageJson, danielScene, sanctuaryScene, sanctuaryData, assetBoundary, revelationScene, revelationData, glossaryScene, glossaryData] = await Promise.all([
    projectContent(),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/components/DanielStatue3D.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/SanctuaryAssembly3D.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/sanctuary.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/three/AssetErrorBoundary.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/RevelationPanorama.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/revelation.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/PropheticGlossary.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/data/glossary.ts", import.meta.url), "utf8"),
  ]);

  assert.match(page, /Iglesia Adventista/);
  assert.match(page, /Elena G\. de White/);
  assert.match(page, /Esteban Bohr/);
  assert.match(page, /Perspectiva pastoral/);
  assert.match(page, /No fijamos fechas/);
  assert.doesNotMatch(page + danielScene + sanctuaryScene, /Tripo AI|tripo3d\.ai/i);
  assert.match(page, /statue-scene/);
  assert.doesNotMatch(page, /Vista de la estatua|statue-figure|statue-piece/);
  assert.equal((page.match(/Infografía 2D/g) ?? []).length, 1);
  assert.match(page, /duration: "≈ 66 años"/);
  assert.match(page, /duration: "≈ 208 años"/);
  assert.match(page, /duration: "≈ 163 años"/);
  assert.match(page, /duration: "≈ 643 años"/);
  assert.match(page, /Duración aproximada/);
  assert.match(page, /Medida bíblica/);
  assert.match(page, /sanctuary-model/);
  assert.match(page, /RevelationPanorama/);
  assert.match(page, /PropheticGlossary/);
  assert.equal((page.match(/notebookUrl: "https:\/\/notebook\.google\.com\/notebook\//g) ?? []).length, 8);
  assert.match(page, /Abrir notebook completo/);
  assert.match(page, /[Vv]erifica (sus|las) respuestas con las fuentes originales/);
  assert.match(glossaryScene, /type="search"/);
  assert.match(glossaryScene, /aria-live="polite"/);
  assert.match(glossaryScene, /aria-haspopup="dialog"/);
  assert.match(glossaryScene, /role="dialog"/);
  assert.doesNotMatch(glossaryScene, /<details/);
  assert.match(glossaryScene, /Definición del texto/);
  assert.equal((glossaryData.match(/^ {4}id: "/gm) ?? []).length, 26);
  assert.match(glossaryData, /Apocalipsis 17:15/);
  assert.match(glossaryData, /Daniel 8:20–22/);
  assert.match(glossaryData, /No es una vacuna, microchip o tecnología específica/);
  assert.match(layout, /https:\/\/profecia\.henrytabimagiraldo\.com/);
  assert.doesNotMatch(layout, /chatgpt\.site/);
  assert.match(revelationScene, /Tres panoramas, una historia/);
  assert.match(revelationScene, /Desenlace 13–14/);
  assert.match(revelationScene, /panorama-lane/);
  assert.doesNotMatch(page + revelationScene, /messages-orbit|message-path|message-node/);
  assert.equal((revelationData.match(/id: "church-/g) ?? []).length, 7);
  assert.equal((revelationData.match(/id: "seal-/g) ?? []).length, 7);
  assert.equal((revelationData.match(/id: "trumpet-/g) ?? []).length, 7);
  assert.equal((revelationData.match(/id: "climax-/g) ?? []).length, 5);
  assert.match(revelationData, /Identificación histórica debatida/);
  assert.match(revelationData, /bands: \["D", "E"\]/);
  assert.match(page, /lazy\(\(\) => import\("\.\/DanielStatue3D"\)\)/);
  assert.match(page, /canvas\.getContext\("webgl2"\)/);
  assert.match(page, /IntersectionObserver/);
  assert.match(danielScene, /frameloop="demand"/);
  assert.match(sanctuaryScene, /frameloop="demand"/);
  assert.match(danielScene + sanctuaryScene, /aria-hidden="true"/);
  assert.match(danielScene, /useGLTF\(STATUE_MODEL_URL\)/);
  assert.match(danielScene, /useGLTF\(BOULDER_MODEL_URL\)/);
  assert.match(danielScene, /DEFAULT_CAMERA_POSITION[^=]*= \[3\.4, 3\.09, 9\.33\]/);
  assert.match(danielScene, /DEFAULT_CAMERA_TARGET[^=]*= \[0, 0\.35, 0\]/);
  assert.match(danielScene, /boulderHitboxSize/);
  assert.match(danielScene, /activeIndex === 5 \|\| guideIndex === 5/);
  assert.match(sanctuaryScene, /useGLTF\(config\.modelUrl\)/);
  assert.match(sanctuaryScene, /useGLTF\(sanctuaryEnvironmentModels\.courtyardPanel\)/);
  assert.match(sanctuaryScene, /useGLTF\(sanctuaryEnvironmentModels\.entranceGate\)/);
  assert.match(sanctuaryScene, /useGLTF\(sanctuaryEnvironmentModels\.tabernacleCutaway\)/);
  assert.match(sanctuaryScene, /new Box3\(\)\.setFromObject\(model\)/);
  assert.match(sanctuaryScene, /CameraFocusRig/);
  assert.match(sanctuaryScene, /useFrame/);
  assert.match(sanctuaryScene, /<instancedMesh/);
  assert.match(page, /focusRequest=\{sanctuaryFocusRequest\}/);
  assert.equal((sanctuaryData.match(/modelUrl: "\/models\//g) ?? []).length, 6);
  assert.equal((sanctuaryData.match(/measure:/g) ?? []).length, 7);
  assert.match(danielScene, /daniel-statue-tripo-v31-v1\.glb/);
  assert.match(danielScene, /daniel-boulder-tripo-v31-v1\.glb/);
  assert.match(sanctuaryData, /sanctuary-burnt-altar-tripo-v31-v1\.glb/);
  assert.match(sanctuaryData, /sanctuary-laver-tripo-v31-v1\.glb/);
  assert.match(sanctuaryData, /sanctuary-showbread-table-tripo-v31-v1\.glb/);
  assert.match(sanctuaryData, /sanctuary-lampstand-tripo-v31-v1\.glb/);
  assert.match(sanctuaryData, /sanctuary-incense-altar-tripo-v31-v1\.glb/);
  assert.match(sanctuaryData, /sanctuary-ark-tripo-v31-v1\.glb/);
  assert.match(sanctuaryData, /sanctuary-courtyard-panel-tripo-v31-v1\.glb/);
  assert.match(sanctuaryData, /sanctuary-entrance-gate-tripo-v31-v1\.glb/);
  assert.match(sanctuaryData, /sanctuary-tabernacle-cutaway-tripo-v31-v1\.glb/);
  assert.doesNotMatch(danielScene, /Ver esquema|Reconstrucción IA|three-reconstruction-control|three-transform-control/);
  assert.doesNotMatch(sanctuaryScene, /Ver esquema|Reconstrucción IA|three-reconstruction-control|three-transform-control|sanctuary-diorama/i);
  assert.match(assetBoundary, /this\.state\.failed \? this\.props\.fallback/);
  assert.doesNotMatch(danielScene + sanctuaryScene, /useGLTF\.preload/);
  assert.doesNotMatch(danielScene + sanctuaryScene, /autoRotate/);
  assert.doesNotMatch(danielScene, /useFrame/);
  assert.match(packageJson, /@react-three\/fiber/);
  assert.match(layout, /openGraph/);
  assert.doesNotMatch(page + layout + packageJson, /_sites-preview|react-loading-skeleton|codex-preview/);
});

test("keeps public study resources in Spanish and separates historical context", async () => {
  const [page, glossary, glossaryScene] = await Promise.all([
    projectContent(),
    readFile(new URL("../app/data/glossary.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/PropheticGlossary.tsx", import.meta.url), "utf8"),
  ]);
  const publicResources = page + glossary + glossaryScene;
  const englishOrGenericResources = [
    "secretsunsealed.org",
    "adventist.org/es/beliefs/official",
    "adventist.org/beliefs/official",
    "www.adventist.org/remnant-and-its-mission",
    "www.adventist.org/religious-liberty",
    "adventistbiblicalresearch.org/en/articles",
    "articles/prophetic-basis-of-adventism",
    "articles/answers-to-questions-on-the-mark-of-the-beast-and-end-time-events",
    "articles/furniture-with-a-message",
    "articles/significance-of-the-structure-of-revelation",
    "articles/recapitulation-in-revelation",
    "articles/issues-in-the-interpretation-of-the-seven-trumpets",
    "articles/miniature-symbolization-and-the-year-day-principle",
    "articles/the-sanctuary-and-its-cleansing",
    "articles/is-babylon-the-papacy",
    "articles/the-sealing-of-humans",
    "text.egwwritings.org/read/84.1553",
    "www.biblegateway.com/passage",
    "The Great Cosmic Controversy",
    "Biblical Research Institute\"",
  ];

  for (const resource of englishOrGenericResources) {
    assert.doesNotMatch(publicResources, new RegExp(resource.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  }

  assert.match(page, /Contexto histórico/);
  assert.match(page, /institucional\.adventistas\.org\/es\/nuestras-crencias/);
  assert.match(page, /revistas\.comillas\.edu/);
  assert.match(page, /historiayespacio\.univalle\.edu\.co/);
  assert.match(page, /asclepio\.revistas\.csic\.es/);
  assert.match(glossary, /Instituto de Investigación Bíblica \(BRI\)/);
});

test("ships one public NotebookLM destination and one internal editorial package per lesson", async () => {
  const lessonFolders = [
    "01-gran-conflicto",
    "02-como-leer-profecia",
    "03-daniel-8-9-1844",
    "04-santuario-juicio",
    "05-tres-angeles",
    "06-adoracion-libertad",
    "07-muerte-discernimiento",
    "08-venida-tierra-nueva",
  ];
  const [readme, masterPrompt, sourcePolicy, vercelIgnore] = await Promise.all([
    readFile(new URL("../docs/notebooklm/README.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/notebooklm/prompt-maestro.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/notebooklm/politica-de-fuentes.md", import.meta.url), "utf8"),
    readFile(new URL("../.vercelignore", import.meta.url), "utf8"),
  ]);

  assert.match(readme, /notebook público por cada uno de los ocho estudios/i);
  assert.match(readme, /formato principal de distribución/i);
  assert.match(readme, /no es necesario alojarlos en este proyecto/i);
  assert.match(masterPrompt, /El texto bíblico afirma\/describe/);
  assert.match(masterPrompt, /La interpretación adventista entiende\/relaciona/);
  assert.match(masterPrompt, /La fuente histórica documenta/);
  assert.match(sourcePolicy, /claims_not_supported/);
  assert.match(vercelIgnore, /^docs\/$/m, "the editorial kit must remain outside the public deployment");

  const page = await projectContent();
  const notebookPattern = /https:\/\/notebook\.google\.com\/notebook\/[0-9a-f-]+/g;
  const publicNotebooks = [...new Set(page.match(notebookPattern) ?? [])].sort();
  const documentedNotebooks = [...new Set(readme.match(notebookPattern) ?? [])].sort();
  assert.equal(publicNotebooks.length, 8);
  assert.deepEqual(publicNotebooks, documentedNotebooks, "the public UI and editorial catalog must use the same notebooks");

  for (const folder of lessonFolders) {
    const [content, prompt, rawSources] = await Promise.all([
      readFile(new URL(`../docs/notebooklm/${folder}/contenido.md`, import.meta.url), "utf8"),
      readFile(new URL(`../docs/notebooklm/${folder}/prompt.md`, import.meta.url), "utf8"),
      readFile(new URL(`../docs/notebooklm/${folder}/fuentes.json`, import.meta.url), "utf8"),
    ]);
    const catalog = JSON.parse(rawSources);

    assert.ok(content.length > 900, `${folder} needs a substantive Spanish dossier`);
    assert.ok(prompt.length > 350, `${folder} needs lesson-specific audio direction`);
    assert.equal(catalog.lesson_id, folder);
    assert.ok(catalog.sources.length >= 5, `${folder} needs a balanced source set`);
    for (const source of catalog.sources) {
      assert.equal(source.public_language, "es");
      assert.match(source.url, /^https:\/\//);
      assert.ok(source.claims_not_supported.length > 0, `${source.id} must declare its limits`);
    }
  }
});

test("ships valid, lightweight local GLB reconstructions", async () => {
  const assets = [
    "../public/models/daniel-statue-tripo-v31-v1.glb",
    "../public/models/daniel-boulder-tripo-v31-v1.glb",
    "../public/models/sanctuary-burnt-altar-tripo-v31-v1.glb",
    "../public/models/sanctuary-laver-tripo-v31-v1.glb",
    "../public/models/sanctuary-showbread-table-tripo-v31-v1.glb",
    "../public/models/sanctuary-lampstand-tripo-v31-v1.glb",
    "../public/models/sanctuary-incense-altar-tripo-v31-v1.glb",
    "../public/models/sanctuary-ark-tripo-v31-v1.glb",
    "../public/models/sanctuary-courtyard-panel-tripo-v31-v1.glb",
    "../public/models/sanctuary-entrance-gate-tripo-v31-v1.glb",
    "../public/models/sanctuary-tabernacle-cutaway-tripo-v31-v1.glb",
  ];

  for (const asset of assets) {
    const glb = await readFile(new URL(asset, import.meta.url));
    assert.equal(glb.subarray(0, 4).toString("ascii"), "glTF");
    assert.ok(glb.byteLength < 2 * 1024 * 1024, `${asset} must stay below 2 MB`);
  }
});

test("ships a lightweight local courtyard dirt texture", async () => {
  const texture = await readFile(new URL("../public/textures/sanctuary-dirt-v1.webp", import.meta.url));
  assert.equal(texture.subarray(0, 4).toString("ascii"), "RIFF");
  assert.equal(texture.subarray(8, 12).toString("ascii"), "WEBP");
  assert.ok(texture.byteLength < 512 * 1024, "courtyard texture must stay below 512 KB");
});
