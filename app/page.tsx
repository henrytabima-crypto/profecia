"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { awardTransition, resumeLesson, type AwardTransition } from "./data/expedition";
import { modules } from "./data/studies";
import { useDanielJourney } from "./hooks/useDanielJourney";
import useQuickTransition from "./hooks/useQuickTransition";
import { levelDefinitions } from "./data/levels";
import ExpeditionWorld, { ExpeditionIcon } from "./components/ExpeditionWorld";
import FirstLevel, { FirstLevelReward } from "./components/FirstLevel";
import { clearAdventureStorage } from "./data/resetProgress";
import { canOpenLesson, claimLevel, levelProgress, firstUnfinishedStep, freshJourney, LEGACY_KEY, PROGRESS_KEY, resources, resourceUnlocked, restoreJourney, type Journey, type ResourceId } from "./data/journey";

const ResourceViewer = lazy(() => import("./components/ResourceViewer"));
type Screen = "map" | "lesson" | "gallery" | "resource";

export default function Home() {
  const daniel = useDanielJourney();
  const [journey, setJourney] = useState<Journey>(freshJourney);
  const [savedJourney, setSavedJourney] = useState<Journey | null>(null);
  const [newAward, setNewAward] = useState<number | null>(null);
  const [arrival, setArrival] = useState<AwardTransition | null>(null);
  const pendingArrival = useRef<AwardTransition | null>(null);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [resetError, setResetError] = useState(false);
  const [screen, setScreen] = useState<Screen>("map");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [mapRevision, setMapRevision] = useState(0);
  const [mapSelection, setMapSelection] = useState<number | null>(null);
  const [resourceId, setResourceId] = useState<ResourceId>("glossary");
  const heading = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  const options = useRef<HTMLDialogElement>(null);
  const lesson = modules[lessonIndex];
  const step = journey.steps[lesson.id] ?? 0;
  const resumeIndex = resumeLesson(journey);
  const selectedIndex = mapSelection ?? resumeIndex;
  const saving = ready && !storageError && savedJourney !== journey;
  const earnedResources = resources.filter((resource) => resource.lesson >= 0 && resourceUnlocked(journey, resource));
  const selectedResource = resources.find((resource) => resource.id === resourceId)!;
  const content = useQuickTransition<HTMLDivElement>(`${screen}:${lessonIndex}:${step}:${resourceId}`, { distance: screen === "resource" ? 0 : 6 });

  useEffect(() => {
    try {
      const saved = restoreJourney(window.localStorage.getItem(PROGRESS_KEY), window.localStorage.getItem(LEGACY_KEY));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydrate device-local progress after SSR.
      setJourney(saved);
    } catch { setStorageError(true); }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(journey));
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Report whether browser persistence actually succeeded.
      setStorageError(false);
      // Confirm persistence only after the local write succeeds.
      setSavedJourney(journey);
    } catch { setStorageError(true); }
  }, [journey, ready]);

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [screen, lessonIndex, step, resourceId]);

  function openLesson(index: number) {
    if (!ready || !daniel.ready || !canOpenLesson(journey, index)) return;
    setNewAward(null);
    setArrival(null);
    pendingArrival.current = null;
    const savedStep = Math.min(journey.steps[modules[index].id] ?? 0, firstUnfinishedStep(journey, index));
    setJourney((state) => ({ ...state, started: true, currentLesson: index, firstLevel: index === 0 ? { ...state.firstLevel, started: true } : state.firstLevel, levels: index > 0 ? { ...state.levels, [modules[index].id]: { ...levelProgress(state, index), started: true } } : state.levels, steps: { ...state.steps, [modules[index].id]: savedStep } }));
    setLessonIndex(index);
    setScreen("lesson");
  }
  function showMap(index?: number) {
    const pending = pendingArrival.current;
    const event = pending && (index === undefined || index === pending.from || index === pending.to) ? pending : null;
    pendingArrival.current = null;
    setNewAward(null);
    setArrival(event);
    setMapSelection(event?.to ?? index ?? null);
    setScreen("map");
  }
  function claimMission() {
    const updated = claimLevel(journey, lessonIndex);
    const event = awardTransition(journey, updated, lessonIndex);
    setJourney(updated);
    setNewAward(event ? lessonIndex : null);
    pendingArrival.current = event;
  }
  function resetAdventure() {
    options.current?.close();
    setNewAward(null);
    setArrival(null);
    pendingArrival.current = null;
    let cleared = false;
    try { cleared = clearAdventureStorage(window.localStorage); } catch { /* Browser storage may be unavailable. */ }
    setResetError(!cleared);
    setJourney(freshJourney());
    daniel.dispatch({ type: "reset" });
    setLessonIndex(0);
    setMapSelection(null);
    setResourceId("glossary");
    setMapRevision((revision) => revision + 1);
    setScreen("map");
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  function openResource(id: ResourceId) {
    const resource = resources.find((item) => item.id === id);
    if (!resource || !resourceUnlocked(journey, resource)) return;
    setNewAward(null);
    setResourceId(id);
    setScreen("resource");
  }

  return <main className={`game-shell${screen === "map" ? " is-world" : ""}`}>
    <a className="game-skip" href="#game-content">Saltar al contenido</a>
    <header className="game-header">
      <button className="game-brand" type="button" onClick={() => showMap()} aria-label="Profecía, volver al mapa"><span className="brand-mark" aria-hidden="true">P</span><span>PROFECÍA<small>La expedición</small></span></button>
      <div className="game-header-progress" aria-label={`${journey.completed.length} de 8 misiones completadas`}><span aria-hidden="true">✦</span><b>{journey.completed.length}</b><span>/ 8</span><progress value={journey.completed.length} max={8} aria-label="Misiones completadas" /></div>
    </header>

    {resetError && <p className="game-storage-warning" role="status">Reiniciamos la aventura en esta página, pero el navegador impidió borrar parte del guardado anterior. Podría reaparecer al recargar.</p>}
    {storageError && <p className="game-storage-warning" role="status">Puedes continuar, pero el navegador no permite guardar tu avance. Se conservará mientras mantengas esta página abierta.</p>}
    {journey.unlockedAll && <div className="game-free-banner">Exploración libre activa · Todo está disponible. Tus logros siguen contando solo las misiones completadas.</div>}

    <div ref={content} id="game-content" className={`game-content game-screen-${screen}`}>
      {screen === "map" && !ready && <p className="level-sr" role="status">Cargando tu progreso…</p>}
      {screen === "map" && <ExpeditionWorld key={`${ready && daniel.ready}:${mapRevision}`} persistent={!storageError} arrival={arrival} journey={journey} selectedIndex={selectedIndex} ready={ready && daniel.ready} onSelect={setMapSelection} onOpen={openLesson} onResource={openResource} />}

      {screen === "lesson" && <FirstLevel key={lesson.id} definition={levelDefinitions[lessonIndex]} progress={levelProgress(journey, lessonIndex)} persistent={!storageError} saving={saving} newAward={newAward === lessonIndex} onAwardSeen={() => setNewAward(null)} previouslyCompleted={journey.completed.includes(lesson.id)}
        onChange={(update) => setJourney((state) => lessonIndex === 0
          ? { ...state, firstLevel: { ...update(levelProgress(state, 0)), started: true } }
          : { ...state, levels: { ...state.levels, [lesson.id]: { ...update(levelProgress(state, lessonIndex)), started: true } } })}
        onClaim={claimMission} onExit={() => showMap(lessonIndex)}
        unlockedResource={resources.find((resource) => resource.lesson === lessonIndex)} onResource={openResource}
        onNext={() => showMap()} />}

      {screen === "gallery" && <section className="game-gallery" aria-labelledby="gallery-title">
        <div className="game-section-heading"><div><p className="game-kicker">TU COLECCIÓN</p><h1 id="gallery-title" ref={heading} tabIndex={-1}>La galería de hallazgos.</h1><p>Los recursos que descubres en el camino viven aquí.</p></div><span className="game-collection-count"><b>{earnedResources.length}</b> / 5 desbloqueados</span></div>
        {levelDefinitions.filter((definition) => journey.completed.includes(modules[definition.index].id)).map((definition) => <FirstLevelReward key={definition.index} definition={definition} />)}
        <div className="game-gallery-grid">{resources.filter((resource) => resource.lesson >= 0).map((resource) => {
          const unlocked = resourceUnlocked(journey, resource);
          return <article key={resource.id} className={`game-resource-card${unlocked ? " unlocked" : " locked"}`}><div className={`game-resource-art art-${resource.id}`} aria-hidden="true"><span>{resource.glyph}</span><i /></div><div className="game-resource-info"><p className="game-kicker">{resource.kind}</p><h2>{resource.title}</h2><p>{resource.description}</p><button className="game-resource-open" type="button" disabled={!ready} onClick={() => unlocked ? openResource(resource.id) : showMap(resource.lesson)}>{unlocked ? "Explorar recurso" : `Ver misión ${modules[resource.lesson].number}`}<span aria-hidden="true">{unlocked ? "↗" : "◇"}</span></button></div></article>;
        })}</div>
        <div className="game-gallery-tools"><button className="game-tool-card" type="button" onClick={() => openResource("sources")}><span aria-hidden="true">✦</span><span><strong>La brújula del estudio</strong><small>Método y fuentes · Siempre disponible</small></span><span aria-hidden="true">↗</span></button><details className="game-cheat"><summary>Explorar libremente</summary><p>Si vienes de otro navegador o quieres explorar libremente, activa la exploración libre. Abre todas las guías y recursos y conserva tus logros reales.</p><button className="game-secondary" type="button" disabled={!ready} onClick={() => setJourney((state) => ({ ...state, unlockedAll: !state.unlockedAll }))}>{journey.unlockedAll ? "Desactivar exploración libre" : "Desbloquear todos los recursos"}<span aria-hidden="true">⚿</span></button><p className="game-save-note">El progreso es local a este navegador. La exploración libre permite acceder desde otro; no sincroniza tus logros.</p></details></div>
      </section>}

      {screen === "resource" && <section className="game-resource-view" aria-labelledby="resource-title"><div className="game-resource-heading"><button className="game-text-button" type="button" onClick={() => setScreen("gallery")}>← Volver a la galería</button><h1 id="resource-title" ref={heading} tabIndex={-1}>{selectedResource.title}</h1><button className="game-secondary" type="button" onClick={() => showMap()}>Volver al mapa<span aria-hidden="true">→</span></button></div>{resourceUnlocked(journey, selectedResource) && <Suspense fallback={<p className="game-resource-loading" role="status">Abriendo tu hallazgo…</p>}><ResourceViewer key={resourceId} resource={resourceId} exploredVisuals={journey.exploredVisuals} onExplore={(id) => setJourney((state) => state.exploredVisuals.includes(id) ? state : { ...state, exploredVisuals: [...state.exploredVisuals, id] })} onOpenStudy={openLesson} canOpenStudy={(index) => canOpenLesson(journey, index)} /></Suspense>}</section>}
    </div>
    <nav className="game-dock" aria-label="Navegación de la aventura">
      <button type="button" aria-current={screen === "map" ? "page" : undefined} onClick={() => showMap()}><ExpeditionIcon kind="map" /><span>Mapa</span></button>
      <button type="button" aria-current={screen === "gallery" || screen === "resource" ? "page" : undefined} onClick={() => setScreen("gallery")}><ExpeditionIcon kind="gallery" /><span>Galería</span></button>
      <button type="button" aria-haspopup="dialog" onClick={() => options.current?.showModal()}><ExpeditionIcon kind="options" /><span>Opciones</span></button>
    </nav>
    <dialog ref={options} className="game-options-dialog" aria-labelledby="options-title">
      <div className="world-preview-top"><h2 id="options-title">Tu expedición</h2><button className="world-close" type="button" aria-label="Cerrar opciones" onClick={() => options.current?.close()}>✕</button></div>
      <p>Mira, escucha, lee y practica a tu ritmo. Ocho misiones para explorar Daniel y Apocalipsis, con Cristo en el centro. Toca una misión del mapa para comenzar o retomar su último paso.</p>
      <p>Las estrellas marcan tres hitos: mirar y escuchar, leer y explorar, y recibir tu premio. Puedes entrar a cualquier misión y volver a tu recorrido con la brújula.</p>
      <p>{storageError ? "El guardado no está disponible; puedes continuar mientras esta página esté abierta." : "Tu avance se guarda en este navegador."} La exploración libre está disponible en Galería.</p>
      <details key={journey.started ? "active-reset" : "fresh-reset"} className="game-reset"><summary>Reiniciar aventura</summary><p>Volverás a la misión 1. Se borrarán las misiones completadas, los retos, la carta de Daniel y los hallazgos de este navegador. La exploración libre también se desactivará.</p><button className="game-secondary" type="button" disabled={!ready || !daniel.ready} onClick={resetAdventure}>Borrar progreso y volver al mapa</button></details>
    </dialog>
    <footer className="game-footer"><span>PROFECÍA · Una expedición de esperanza</span><span>Perspectiva adventista · A tu ritmo</span></footer>
  </main>;
}
