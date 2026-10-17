"use client";

import { Component, lazy, Suspense, type ReactNode, useEffect, useRef, useState } from "react";
import PropheticGlossary from "./PropheticGlossary";
import { BiblePassage } from "./BibleReader";
import RevelationPanorama from "./RevelationPanorama";
import {
  revelationBands,
  revelationClimax,
  revelationClimaxOverview,
  revelationItems,
  revelationOverview,
  revelationPanoramaItems,
  type RevelationView,
} from "../data/revelation";
import { sanctuaryOverview, sanctuaryStations } from "../data/sanctuary";

const DanielStatue3D = lazy(() => import("./DanielStatue3D"));
const SanctuaryAssembly3D = lazy(() => import("./SanctuaryAssembly3D"));

import { modules } from "../data/studies";
import type { ResourceId } from "../data/journey";

const timelineTracks = {
  daniel2: {
    label: "Daniel 2",
    intro: "La estatua presenta una sucesión de reinos y termina con el reino que Dios establece.",
    stages: [
      ["Babilonia", "Oro", "605–539 a. C. · ≈ 66 años", 19],
      ["Medopersia", "Plata", "539–331 a. C. · ≈ 208 años", 17],
      ["Grecia", "Bronce", "331–168 a. C. · ≈ 163 años", 17],
      ["Roma", "Hierro", "168 a. C.–476 d. C. · ≈ 643 años", 23],
      ["Europa dividida", "Hierro y barro", "Desde 476 d. C. · continúa", 18],
      ["Reino de Dios", "La piedra", "Culminación · eterno", 20],
    ],
  },
  daniel7: {
    label: "Daniel 7",
    intro: "Cuatro bestias repiten el panorama y amplían el juicio y la entrega del reino al Hijo del Hombre.",
    stages: [
      ["Babilonia", "León", "Primer reino", 17],
      ["Medopersia", "Oso", "Segundo reino", 17],
      ["Grecia", "Leopardo", "Tercer reino", 17],
      ["Roma", "Cuarta bestia", "Cuarto reino", 22],
      ["División y cuerno", "Diez cuernos", "Etapa ampliada", 24],
      ["Juicio y reino", "Hijo del Hombre", "Culminación", 21],
    ],
  },
  daniel8: {
    label: "Daniel 8–9",
    intro: "El carnero y el macho cabrío son identificados en el texto; la visión dirige la atención al santuario.",
    stages: [
      ["Medopersia", "Carnero", "Daniel 8:20", 20],
      ["Grecia", "Macho cabrío", "Daniel 8:21", 20],
      ["Cuerno pequeño", "Poder expansivo", "Lectura historicista", 25],
      ["2.300 tardes-mañanas", "457 a. C.–1844", "Santuario", 30],
      ["Juicio", "Daniel 7–8", "Ministerio de Cristo", 20],
    ],
  },
} as const;

type TimelineKey = keyof typeof timelineTracks;

import { empireLayers } from "../data/statueExploration";

const labReferences = {
  daniel: [
    ["Texto bíblico", "Daniel 2", ""],
    ["Investigación bíblica", "Cómo interpretar los símbolos", "https://adventistbiblicalresearch.org/articles/como-interpretar-los-simbolos"],
    ["Esteban Bohr", "La Gran Cadena Profética", "https://sumtvlatino.org/programas/la-gran-cadena-profetica"],
    ["Contexto histórico", "La teoría histórica de los cuatro imperios", "https://dialnet.unirioja.es/servlet/articulo?codigo=5026720"],
  ],
  sanctuary: [
    ["Texto bíblico", "Éxodo 25–30 · Hebreos 7–10", ""],
    ["Investigación bíblica", "El santuario y su purificación", "https://adventistbiblicalresearch.org/articles/el-santuario-y-su-purificacion"],
    ["Creencia oficial", "Ministerio de Cristo en el santuario", "https://institucional.adventistas.org/es/nuestras-crencias/24-el-ministerio-de-cristo-en-el-santuario-celestial/"],
    ["Elena G. de White", "Patriarcas y profetas · cap. 30", "https://text.egwwritings.org/read/1704.1594"],
    ["Contexto histórico", "Objetos del Santuario en la historia judía", "https://www.cultura.gob.es/msefardi/colecciones/piezas-destacadas/repostero.html"],
  ],
  messages: [
    ["Texto bíblico", "Apocalipsis 1–14", ""],
    ["Investigación bíblica", "Apocalipsis 12:7–12", "https://www.adventistbiblicalresearch.org/es/materials/apocalipsis-127-12/"],
    ["Investigación bíblica", "Apocalipsis 13:11", "https://www.adventistbiblicalresearch.org/es/materials/apocalipsis-1311/"],
    ["Investigación bíblica", "Apocalipsis 13:13", "https://www.adventistbiblicalresearch.org/es/materials/apocalipsis-1313/"],
    ["Iglesia Adventista", "Remanente y misión", "https://institucional.adventistas.org/es/nuestras-crencias/13-el-remanente-y-su-mision/"],
    ["Elena G. de White", "El mensaje final de Dios · cap. 39", "https://text.egwwritings.org/read/1710.2757"],
    ["Esteban Bohr", "El mensaje de los tres ángeles", "https://sumtvlatino.org/programas/el-mensaje-de-los-tres-angeles"],
  ],
} as const;

type LabMode = keyof typeof labReferences;
type SanctuaryView = "3d" | "2d";

class ThreeErrorBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function ResourceViewer({ resource, exploredVisuals, onExplore, onOpenStudy, canOpenStudy }: {
  resource: ResourceId;
  exploredVisuals: string[];
  onExplore: (id: string) => void;
  onOpenStudy: (index: number) => void;
  canOpenStudy: (index: number) => boolean;
}) {
  const [timeline, setTimeline] = useState<TimelineKey>("daniel2");
  const labMode: LabMode = resource === "sanctuary" ? "sanctuary" : resource === "messages" ? "messages" : "daniel";
  const [empireFocus, setEmpireFocus] = useState(0);
  const [sanctuaryFocus, setSanctuaryFocus] = useState<number | null>(null);
  const [sanctuaryFocusRequest, setSanctuaryFocusRequest] = useState(0);
  const [revelationView, setRevelationView] = useState<RevelationView>("panorama");
  const [revelationFocusId, setRevelationFocusId] = useState(revelationOverview.id);
  const [sanctuaryView, setSanctuaryView] = useState<SanctuaryView>("3d");
  const [webglAvailable, setWebglAvailable] = useState<boolean | null>(null);
  const [threeRequested, setThreeRequested] = useState(false);
  const labSection = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const available = Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- WebGL can only be detected after the client mounts.
    setWebglAvailable(available);
  }, []);

  useEffect(() => {
    const node = labSection.current;
    if (!node || !("IntersectionObserver" in window)) {
      setThreeRequested(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setThreeRequested(true);
        observer.disconnect();
      }
    }, { rootMargin: "420px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const currentTimeline = timelineTracks[timeline];
  const activeSanctuaryItem = sanctuaryFocus === null
    ? sanctuaryOverview
    : sanctuaryStations[sanctuaryFocus];
  const activeRevelationItem = revelationItems.find((item) => item.id === revelationFocusId)
    ?? (revelationView === "panorama" ? revelationOverview : revelationClimaxOverview);
  const activeLabItem = labMode === "daniel"
    ? empireLayers[empireFocus]
    : labMode === "sanctuary"
      ? activeSanctuaryItem
      : activeRevelationItem;
  const activeLabLabel = labMode === "daniel"
    ? `${empireLayers[empireFocus].part} · ${empireLayers[empireFocus].material}`
    : labMode === "sanctuary"
      ? activeSanctuaryItem.zone
      : activeRevelationItem.kicker;
  const relatedStudy = labMode === "daniel"
    ? modules[1]
    : labMode === "sanctuary"
      ? modules[3]
      : revelationView === "panorama"
        ? modules[1]
        : modules[4];
  const visualTotal = empireLayers.length + sanctuaryStations.length + revelationBands.length + revelationClimax.length;
  const effectiveSanctuaryView: SanctuaryView = sanctuaryView === "3d" && webglAvailable !== false ? "3d" : "2d";
  const showDanielScene = webglAvailable !== false && threeRequested;
  const showSanctuaryScene = effectiveSanctuaryView === "3d" && threeRequested;

  const selectSanctuary = (index: number) => {
    const station = sanctuaryStations[index];
    if (!station) return;
    setSanctuaryFocus((current) => current === index ? null : index);
    setSanctuaryFocusRequest((current) => current + 1);
    onExplore(`sanctuary-${station.id}`);
  };

  const selectRevelation = (id: string) => {
    setRevelationFocusId(id);
    const panoramaItem = revelationPanoramaItems.find((item) => item.id === id);
    if (panoramaItem?.bands?.length) {
      panoramaItem.bands.forEach((band) => onExplore(`revelation-band-${band}`));
      return;
    }
    onExplore(`revelation-${id}`);
  };

  const changeRevelationView = (view: RevelationView) => {
    setRevelationView(view);
    setRevelationFocusId(view === "panorama" ? revelationOverview.id : revelationClimaxOverview.id);
  };

  return <div className="resource-content">
    {(["daniel", "sanctuary", "messages"] as string[]).includes(resource) && <>
      <section className="visual-lab" id="explorar" ref={labSection}>
        <div className="lab-heading">
          <div>
            <p className="overline"><span /> Exploraciones interactivas</p>
            <h2>Aprender tocando<br />las conexiones.</h2>
          </div>
          <div className="lab-progress-copy">
            <p>Gira, acerca y selecciona cada elemento. Cada selección queda en tu registro de hallazgos. Sigue las conexiones y consulta la evidencia.</p>
            <div className="progress-line" aria-label={`${exploredVisuals.length} de ${visualTotal} conexiones exploradas`}>
              <span style={{ width: `${(exploredVisuals.length / visualTotal) * 100}%` }} />
            </div>
            <small>{exploredVisuals.length} de {visualTotal} conexiones exploradas</small>
          </div>
        </div>

        <div className="lab-shell">
          <div className={`lab-workspace${labMode === "messages" ? " revelation-workspace" : ""}`}>
            <div className="lab-stage">
              {labMode === "daniel" && (
                <div className="statue-scene">
                  <div className="scene-caption">
                    <div><span>VISIÓN · DANIEL 2</span><small>Gira y selecciona un material</small></div>
                  </div>
                  {showDanielScene ? (
                    <ThreeErrorBoundary onError={() => setWebglAvailable(false)}>
                      <Suspense fallback={<div className="three-loading"><span />Preparando la estatua 3D…</div>}>
                        <DanielStatue3D
                          activeIndex={empireFocus}
                          onSelect={(index) => { setEmpireFocus(index); onExplore(`empire-${empireLayers[index].id}`); }}
                        />
                      </Suspense>
                    </ThreeErrorBoundary>
                  ) : webglAvailable !== false ? (
                    <div className="three-loading"><span />Preparando la estatua 3D…</div>
                  ) : null}
                  {webglAvailable === false && <p className="three-unavailable" role="status">Esta experiencia 3D requiere un navegador compatible con WebGL.</p>}
                  <div className="scene-legend">
                    {empireLayers.map((layer, index) => (
                      <button type="button" key={layer.id} className={empireFocus === index ? "active" : ""} onClick={() => { setEmpireFocus(index); onExplore(`empire-${layer.id}`); }} aria-pressed={empireFocus === index} aria-label={`${layer.part}: ${layer.title}`}>
                        <i className={`legend-${layer.id}`} /><span>{layer.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {labMode === "sanctuary" && (
                <div className="sanctuary-scene">
                  <div className="scene-caption">
                    <div><span>MODELO · ÉXODO 25–30</span><small>Recorre desde la entrada</small></div>
                    <div className="scene-mode-switch" role="group" aria-label="Vista del santuario">
                      <button type="button" className={effectiveSanctuaryView === "3d" ? "active" : ""} onClick={() => { setSanctuaryView("3d"); setThreeRequested(true); }} disabled={webglAvailable === false} aria-pressed={effectiveSanctuaryView === "3d"}>Vista 3D</button>
                      <button type="button" className={effectiveSanctuaryView === "2d" ? "active" : ""} onClick={() => setSanctuaryView("2d")} aria-pressed={effectiveSanctuaryView === "2d"}>Infografía 2D</button>
                    </div>
                  </div>
                  {showSanctuaryScene ? (
                    <ThreeErrorBoundary onError={() => setWebglAvailable(false)}>
                      <Suspense fallback={<div className="three-loading"><span />Construyendo el santuario 3D…</div>}>
                        <SanctuaryAssembly3D
                          activeIndex={sanctuaryFocus}
                          focusRequest={sanctuaryFocusRequest}
                          onSelect={selectSanctuary}
                        />
                      </Suspense>
                    </ThreeErrorBoundary>
                  ) : effectiveSanctuaryView === "3d" ? (
                    <div className="three-loading"><span />Construyendo el santuario 3D…</div>
                  ) : (
                    <div className="sanctuary-model" aria-label="Infografía interactiva del santuario" role="group">
                      <div className="sanctuary-ground" aria-hidden="true">
                        <span className="sanctuary-altar-shape" />
                        <span className="sanctuary-laver-shape" />
                        <div className="sanctuary-building">
                          <span className="sanctuary-building-lampstand" />
                          <span className="sanctuary-building-table" />
                          <span className="sanctuary-building-incense" />
                          <span className="sanctuary-building-ark" />
                        </div>
                      </div>
                      {sanctuaryStations.map((station, index) => (
                        <button
                          className={`sanctuary-station station-${station.id}${sanctuaryFocus === index ? " active" : ""}`}
                          key={station.id}
                          type="button"
                          onClick={() => selectSanctuary(index)}
                          aria-pressed={sanctuaryFocus === index}
                          aria-label={`${station.zone}: ${station.title}`}
                        ><i aria-hidden="true" /><span>{station.title}</span></button>
                      ))}
                      <div className="sanctuary-zones" aria-hidden="true"><span>ATRIO</span><span>LUGAR SANTO</span><span>LUGAR SANTÍSIMO</span></div>
                    </div>
                  )}
                  {webglAvailable === false && <p className="three-unavailable" role="status">Tu navegador no ofrece WebGL. Mostramos automáticamente la infografía 2D.</p>}
                  {effectiveSanctuaryView === "3d" && <div className="scene-legend sanctuary-scene-legend">
                    {sanctuaryStations.map((station, index) => (
                      <button
                        className={sanctuaryFocus === index ? "active" : ""}
                        key={station.id}
                        type="button"
                        onClick={() => selectSanctuary(index)}
                        aria-pressed={sanctuaryFocus === index}
                        aria-label={`${station.zone}: ${station.title}`}
                      ><i className={`legend-sanctuary-${station.id}`} /><span>{station.title}</span></button>
                    ))}
                  </div>}
                </div>
              )}

              {labMode === "messages" && (
                <RevelationPanorama
                  activeId={revelationFocusId}
                  view={revelationView}
                  onSelect={selectRevelation}
                  onViewChange={changeRevelationView}
                />
              )}
            </div>

            <aside className="lab-inspector" aria-live="polite">
              <div className="inspector-kicker"><span>{activeLabLabel}</span><small>{labMode === "sanctuary" && sanctuaryFocus === null ? "VISTA GENERAL" : labMode === "messages" && revelationFocusId.endsWith("overview") ? "GUÍA DEL MAPA" : "CONEXIÓN ACTIVA"}</small></div>
              <h3>{activeLabItem.title}</h3>
              {"date" in activeLabItem && <div className="inspector-period">
                <div><span>Período representado</span><strong>{activeLabItem.date}</strong></div>
                <div><span>Duración aproximada</span><strong>{activeLabItem.duration}</strong></div>
              </div>}
              {"measure" in activeLabItem && <div className="inspector-measure">
                <span>Medida bíblica</span><strong>{activeLabItem.measure}</strong>
              </div>}
              {labMode === "messages" && <>
                <div className="inspector-period revelation-inspector-meta">
                  <div><span>Franja del panorama</span><strong>{activeRevelationItem.phaseLabel}</strong></div>
                  <div><span>Lente principal</span><strong>{activeRevelationItem.lens}</strong></div>
                </div>
                <div className={`interpretation-level ${activeRevelationItem.confidenceTone}`}>
                  <span>Nivel de lectura</span><strong>{activeRevelationItem.confidence}</strong>
                </div>
              </>}
              <BiblePassage reference={activeLabItem.verse} className="inspector-verse" />
              <p className="inspector-copy">{activeLabItem.insight}</p>
              {labMode === "messages" && <div className="inspector-connection">
                <span>Cómo se conecta</span>
                <p>{activeRevelationItem.connection}</p>
              </div>}
              <div className="inspector-sources">
                <p>Evidencia a mano</p>
                {labReferences[labMode].map(([kind, label, url]) => kind === "Texto bíblico" ? (
                  <BiblePassage key={label} reference={label} className="inspector-bible-source"><small>{kind} · RV1909</small><span>{label}</span><b>Leer aquí</b></BiblePassage>
                ) : url ? (
                  <a href={url} target="_blank" rel="noreferrer" key={label}><small>{kind}</small><span>{label}</span><b>↗</b></a>
                ) : <div key={label}><small>{kind}</small><span>{label}</span></div>)}
              </div>
              <button className="inspector-action" type="button" disabled={!canOpenStudy(modules.indexOf(relatedStudy))} onClick={() => onOpenStudy(modules.indexOf(relatedStudy))}>
                Abrir estudio relacionado <span>→</span>
              </button>
            </aside>
          </div>
        </div>
      </section>

    </>}
    {resource === "timeline" && <>
      <section className="timeline-section" id="cronologia">
        <div className="timeline-heading">
          <div>
            <p className="overline"><span /> Repetición y ampliación</p>
            <h2>La cadena profética.</h2>
          </div>
          <p>Esta visualización resume la lectura historicista adventista. Las fechas son referencias históricas aproximadas, no predicciones futuras.</p>
        </div>

        <div className="timeline-switcher" role="group" aria-label="Selecciona una visión profética">
          {(Object.keys(timelineTracks) as TimelineKey[]).map((key) => (
            <button key={key} className={timeline === key ? "active" : ""} onClick={() => setTimeline(key)} aria-pressed={timeline === key}>
              {timelineTracks[key].label}
            </button>
          ))}
        </div>

        <div className="timeline-panel">
          <div className="timeline-context">
            <span>VISIÓN ACTIVA</span>
            <h3>{currentTimeline.label}</h3>
            <p>{currentTimeline.intro}</p>
          </div>
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Focusable horizontal scroll region supports keyboard navigation. */}
          <div className="timeline-scroll" role="region" tabIndex={0} aria-label={`Cronología de ${currentTimeline.label}`}>
            <div className="timeline-track">
              {currentTimeline.stages.map(([name, symbol, date, weight], index) => (
                <article className="timeline-stage" style={{ flex: weight }} key={name}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div className="stage-dot" />
                  <small>{date}</small>
                  <h4>{name}</h4>
                  <p>{symbol}</p>
                </article>
              ))}
            </div>
          </div>
          <p className="timeline-note"><span>Nota de lectura</span> Otras tradiciones cristianas interpretan estas visiones de manera diferente. Aquí se expone de forma transparente el enfoque historicista adventista.</p>
        </div>
      </section>

    </>}
    {resource === "glossary" && <PropheticGlossary />}
    {resource === "sources" && <>
      <section className="method-section" id="metodo">
        <div className="method-intro">
          <p className="overline"><span /> El método</p>
          <h2>Cuatro lentes.<br />Una fuente principal.</h2>
          <p>La Biblia ocupa el primer lugar. Cada recurso complementario se identifica para que puedas distinguir texto, doctrina e interpretación.</p>
        </div>
        <div className="method-grid">
          {[
            ["01", "Contexto", "Leer antes y después; reconocer género, audiencia y situación histórica."],
            ["02", "Paralelos", "Comparar pasajes y permitir que los símbolos encuentren eco en la propia Biblia."],
            ["03", "Historia", "Contrastar hechos verificables sin forzar el último titular dentro de la profecía."],
            ["04", "Cristo", "Preguntar siempre qué revela el pasaje acerca de su obra, carácter y reino."],
          ].map(([number, title, copy]) => (
            <article className="method-card" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sources-section" id="fuentes">
        <div className="sources-copy">
          <p className="overline"><span /> Mesa de fuentes</p>
          <h2>Saber de dónde<br />viene cada idea.</h2>
          <p>La transparencia es parte del método. El sitio no equipara una interpretación pastoral con una creencia oficial ni sustituye el estudio personal de la Biblia.</p>
          <a href="https://text.egwwritings.org/read/1710.2" target="_blank" rel="noreferrer">Abrir El conflicto de los siglos <span>↗</span></a>
        </div>
        <div className="source-levels">
          {[
            ["01", "Biblia", "Fuente normativa", "El punto de partida y el criterio para evaluar toda enseñanza."],
            ["02", "Creencias oficiales", "Iglesia Adventista", "Permiten identificar qué afirma formalmente la denominación."],
            ["03", "Elena G. de White", "Fuente adventista primaria", "El conflicto de los siglos aporta un marco narrativo e histórico-teológico."],
            ["04", "Esteban Bohr", "Perspectiva pastoral", "SUMtv Latino ofrece exposición pastoral, pero no es un órgano doctrinal oficial."],
            ["05", "Historia e investigación", "Contexto documentado", "Archivos, museos y estudios académicos iluminan el contexto sin convertirlo en prueba doctrinal."],
          ].map(([number, title, label, copy]) => (
            <article key={number}>
              <span>{number}</span>
              <div><small>{label}</small><h3>{title}</h3><p>{copy}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="care-section">
        <p className="overline"><span /> Una lectura responsable</p>
        <h2>Profecía sin sensacionalismo.</h2>
        <div className="care-grid">
          <p><strong>No fijamos fechas.</strong> La fecha de la Segunda Venida no ha sido revelada.</p>
          <p><strong>Distinguimos sistemas de personas.</strong> La crítica profética no justifica hostilidad hacia creyentes de ninguna tradición.</p>
          <p><strong>No convertimos noticias en pruebas.</strong> Un acontecimiento actual requiere análisis, contexto y humildad.</p>
        </div>
      </section>

    </>}
  </div>;
}
