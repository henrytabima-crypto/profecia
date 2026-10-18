"use client";

import { useId, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { flushSync } from "react-dom";
import { firstLevelComplete, levelStages, practiceStage, rewardStage, statueComplete, exploreStatuePart, levelTaskComplete, firstLevelDefinition, firstLevelReach, type LevelDefinition, type FirstLevelProgress } from "../data/firstLevel";
import { BiblePassage } from "./BibleReader";
import LevelVideo from "./LevelVideo";
import LevelMatching from "./LevelMatching";
import LevelClassification from "./LevelClassification";
import StatueExploration from "./StatueExploration";
import { stageComplete } from "../data/expedition";
import type { resources, ResourceId } from "../data/journey";
import { modules } from "../data/studies";

type Props = { definition?: LevelDefinition; progress: FirstLevelProgress; onChange: (update: (state: FirstLevelProgress) => FirstLevelProgress) => void; onClaim: () => void; onExit: () => void; onNext: () => void; persistent: boolean; saving?: boolean; newAward?: boolean; onAwardSeen?: () => void; previouslyCompleted?: boolean; unlockedResource?: typeof resources[number]; onResource?: (id: ResourceId) => void };

export function FirstLevelReward({ definition = firstLevelDefinition }: { definition?: LevelDefinition }) {
  const firstLevelMedia = definition.media;
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  return <article className="level-stamp">
    <p className="game-kicker">TU COLECCIÓN · MISIÓN {String(definition.index + 1).padStart(2, "0")}</p>
    <span className="level-stamp-mark" aria-hidden="true">✦</span>
    <h2>{definition.badge}</h2>
    <p>{definition.title}</p>
    {firstLevelMedia.infographic ? <>
      <button className="level-infographic-preview" type="button" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}>
        <Image src={firstLevelMedia.infographic} alt={`Infografía de ${definition.title}`} width={2752} height={1536} sizes="(max-width: 600px) 85vw, 490px" />
        <span>Ampliar mi infografía</span>
      </button>
      <dialog ref={dialog} className="level-infographic-dialog" aria-labelledby={titleId}>
        <div className="level-infographic-heading"><h2 id={titleId}>{definition.title}</h2><button type="button" className="game-secondary" onClick={() => dialog.current?.close()}>Cerrar ✕</button></div>
        <p>Desliza la imagen para recorrerla de lado a lado.</p>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Keyboard users need focus to scroll the enlarged image. */}
        <div className="level-infographic-scroll" tabIndex={0} role="region" aria-label="Infografía ampliada. Desplázate para leer sus secciones."><Image src={firstLevelMedia.infographic} alt={`Infografía ampliada de ${definition.title}`} width={2752} height={1536} sizes="1600px" /></div>
        <a href={firstLevelMedia.infographic} target="_blank" rel="noreferrer">Abrir imagen original ↗</a>
      </dialog>
    </> : <>
      <p>{definition.summary}</p>
    </>}
  </article>;
}

export default function FirstLevel({ definition = firstLevelDefinition, progress: state, onChange, onClaim, onExit, onNext, persistent, saving = false, newAward = false, onAwardSeen, previouslyCompleted, unlockedResource, onResource }: Props) {
  const { media: firstLevelMedia, readings: firstLevelReadings, tasks: firstLevelTasks } = definition;
  const study = modules[definition.index];
  const stages = levelStages(definition);
  const practice = practiceStage(definition);
  const reward = rewardStage(definition);
  const exploringStatue = definition.exploration === "statue" && state.stage === 3;
  const statueReadings = definition.explorationReadings ?? [];
  const statueReading = statueReadings[state.statuePart];
  const [recentStage, setRecentStage] = useState<number | null>(null);
  const [confirmedNow, setConfirmedNow] = useState(false);
  const [wrong, setWrong] = useState<number | null>(null);
  const [selectedCard, setSelectedCard] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const stageNavigation = useRef<HTMLElement>(null);
  const [stageOverflow, setStageOverflow] = useState({ start: false, end: false });
  const level = useRef<HTMLElement>(null);
  const transition = useRef<{ skipTransition: () => void } | null>(null);
  const task = firstLevelTasks[state.task];
  const solved = levelTaskComplete(state, state.task, definition);
  const reading = firstLevelReadings[state.reading];
  const mediaKind = state.stage === 0 ? "video" : "podcast";
  const media = firstLevelMedia[mediaKind];
  const positionKey = `${mediaKind}:${media?.id ?? "reading"}`;
  const seconds = state.positions[positionKey] ?? 0;
  const videoStep = state.stage < 2 && Boolean(media);
  // Selecting a statue part updates this view in place; it is not navigation.
  const progressKey = `${state.stage}:${state.reading}:${state.task}`;

  useLayoutEffect(() => {
    heading.current?.focus({ preventScroll: true });
    level.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [progressKey]);

  useLayoutEffect(() => {
    const navigation = stageNavigation.current;
    if (!navigation) return;
    const syncOverflow = () => {
      const next = { start: navigation.scrollLeft > 1, end: navigation.scrollLeft + navigation.clientWidth < navigation.scrollWidth - 1 };
      setStageOverflow((previous) => previous.start === next.start && previous.end === next.end ? previous : next);
    };
    const revealActive = () => {
      const active = navigation.querySelector<HTMLButtonElement>("[aria-current='step']");
      if (active) navigation.scrollTo({ left: navigation.scrollLeft + active.getBoundingClientRect().left - navigation.getBoundingClientRect().left - (navigation.clientWidth - active.offsetWidth) / 2, behavior: "instant" });
    };
    revealActive();
    const frame = requestAnimationFrame(syncOverflow);
    const observer = new ResizeObserver(() => { revealActive(); syncOverflow(); });
    observer.observe(navigation);
    navigation.addEventListener("scroll", syncOverflow, { passive: true });
    return () => { cancelAnimationFrame(frame); observer.disconnect(); navigation.removeEventListener("scroll", syncOverflow); };
  }, [state.stage, stages.length]);

  function move(update: () => void, completedStage?: number) {
    if (state.stage === reward) onAwardSeen?.();
    const apply = () => { setRecentStage(completedStage ?? null); setConfirmedNow(false); setWrong(null); setSelectedCard(false); update(); };
    transition.current?.skipTransition();
    if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      transition.current = document.startViewTransition(() => flushSync(apply));
    } else apply();
  }
  function patch(changes: Partial<FirstLevelProgress>) { onChange((prev) => ({ ...prev, started: true, ...changes })); }
  function go(stage: number) { if (stage <= firstLevelReach(state, definition)) move(() => patch({ stage })); }
  function choose(index: number) {
    if (solved || (task.card && !selectedCard)) return;
    if (index === task.answer) {
      setConfirmedNow(true);
      setWrong(null);
      onChange((prev) => ({ ...prev, solved: [...prev.solved.slice(0, prev.task), index] }));
    } else setWrong(index);
  }
  function forward() {
    if (state.stage < 2) {
      move(() => onChange((prev) => ({ ...prev, mediaDone: [...new Set([...prev.mediaDone, prev.stage])], stage: prev.stage + 1 })), state.mediaDone.includes(state.stage) ? undefined : state.stage);
    } else if (state.stage === 2) {
      move(() => onChange((prev) => {
        const explored = [...new Set([...prev.explored, prev.reading])];
        const pendingReading = firstLevelReadings.findIndex((_, i) => !explored.includes(i));
        const nextReading = pendingReading < 0 && prev.reading < firstLevelReadings.length - 1 ? prev.reading + 1 : pendingReading;
        return { ...prev, explored, reading: nextReading < 0 ? prev.reading : nextReading, stage: nextReading < 0 ? 3 : 2 };
      }), !stageComplete(state, definition, 2) && firstLevelReadings.every((_, i) => i === state.reading || state.explored.includes(i)) ? 2 : undefined);
    } else if (exploringStatue) {
      if (statueComplete(state, definition)) move(() => patch({ stage: practice }));
    } else if (state.stage === practice && solved) {
      if (state.task === firstLevelTasks.length - 1) { if (firstLevelComplete(state, definition)) move(onClaim); }
      else move(() => patch({ task: state.task + 1 }));
    }
  }
  function back() {
    if (state.stage === practice && state.task > 0) move(() => patch({ task: state.task - 1 }));
    else if (state.stage === 2 && state.reading > 0) move(() => patch({ reading: state.reading - 1 }));
    else if (state.stage > 0) go(state.stage - 1);
    else onExit();
  }

  return <section ref={level} className={`first-level${videoStep ? " is-video" : ""}`} aria-labelledby="first-level-title">
    <div className="level-top"><button type="button" className="game-text-button" onClick={onExit}>← Volver al mapa</button><span>Misión {study.number} · {definition.title}</span></div>
    <div className="level-stages-wrap" data-overflow-start={stageOverflow.start || undefined} data-overflow-end={stageOverflow.end || undefined}>
    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- Keyboard users need to scroll the single row, including disabled stages. */}
    <nav ref={stageNavigation} tabIndex={0} aria-label={`Etapas de la misión ${study.number}`} className={`level-stages${stages.length === 6 ? " level-stages-six" : ""}`}>{stages.map((label, i) => {
      const done = stageComplete(state, definition, i);
      return <button type="button" key={label} className={`${done ? "is-complete" : ""}${recentStage === i ? " is-just-completed" : ""}`} disabled={i > firstLevelReach(state, definition)} aria-current={state.stage === i ? "step" : undefined} onClick={() => go(i)}><span aria-hidden="true">{done ? "✓" : i + 1}</span>{label}<span className="level-sr">{done ? ", completado" : ""}</span></button>;
    })}</nav>
    </div>
    <div className={`level-page${newAward ? " is-new-award" : ""}`}>
      <h1 id="first-level-title" ref={heading} tabIndex={-1}>{state.stage === 0 ? definition.index === 0 ? "Una historia para mirar con esperanza." : `Descubre: ${definition.title}.` : state.stage === 1 ? "Escucha y conecta las ideas." : state.stage === 2 ? reading.title : exploringStatue ? "Descubre la estatua de Daniel." : state.stage === practice ? task.prompt : newAward ? "Una nueva pieza en tu colección." : "Tu hallazgo sigue aquí."}</h1>

      {state.stage < 2 && <>
        {media ? <LevelVideo key={positionKey} id={media.id} title={`${state.stage === 0 ? "Video introductorio" : "Escucha"}: ${definition.title}`} start={seconds} onPosition={(position) => onChange((prev) => ({ ...prev, positions: { ...prev.positions, [positionKey]: position } }))} /> : <article className="level-reading-card"><h2>Lectura de apoyo</h2><p>{state.stage === 0 ? "El video estará disponible próximamente." : "El podcast estará disponible próximamente."}</p><p>{definition.summary}</p>{firstLevelReadings.map((part, i) => <section key={i}><h3>{part.title}</h3><p>{part.text}</p><BiblePassage reference={part.reference} /></section>)}</article>}
      </>}

      {state.stage === 2 && <>
          <article className="level-reading-card"><p>{reading.text}</p><BiblePassage reference={reading.reference} /></article>
          <ul className="level-checklist" aria-label="Ideas leídas">{firstLevelReadings.map((part, i) => <li key={i}><span aria-hidden="true">{state.explored.includes(i) ? "✓" : "○"}</span>{part.title}<span className="level-sr">{state.explored.includes(i) ? ", leída" : ", pendiente"}</span></li>)}</ul>
      </>}
      {exploringStatue && <StatueExploration active={state.statuePart} explored={state.statueExplored} onSelect={(statuePart) => onChange((prev) => exploreStatuePart(prev, statuePart, definition))}>
        <article className="level-reading-card" aria-live="polite" aria-atomic="true"><h2>{statueReading.title}</h2><p>{statueReading.text}</p><BiblePassage reference={statueReading.reference} /></article>
      </StatueExploration>}

      {state.stage === practice && (task.kind === "Conecta" ? <LevelMatching key={state.task} definition={definition} progress={state} onChange={onChange} /> : task.kind === "Clasifica" ? <LevelClassification key={state.task} definition={definition} progress={state} onChange={onChange} /> : <>
        {task.card && <p className="level-lead">Toca la tarjeta y después elige dónde corresponde. También puedes arrastrarla.</p>}
        {task.card && !solved && <button type="button" className={`level-source-card${selectedCard ? " selected" : ""}`} aria-pressed={selectedCard} draggable onDragStart={(event) => { event.dataTransfer.setData("text/plain", `level-card-${state.task}`); event.dataTransfer.effectAllowed = "move"; setSelectedCard(true); }} onClick={() => setSelectedCard(true)}>{task.card}</button>}
        <div className={`level-options${task.card ? " level-categories" : ""}`} role="group" aria-label="Respuestas">{task.options.map((option, i) => <button type="button" key={option} className={`${solved && i === task.answer ? "correct" : ""}${wrong === i ? " wrong" : ""}`} aria-disabled={solved || Boolean(task.card && !selectedCard)} onClick={() => choose(i)} onDragOver={(event) => { if (!solved) event.preventDefault(); }} onDrop={(event) => { event.preventDefault(); if (event.dataTransfer.getData("text/plain") === `level-card-${state.task}`) choose(i); }}><span aria-hidden="true">{solved && i === task.answer ? "✓" : wrong === i ? "!" : String.fromCharCode(65 + i)}</span><span className="level-option-label">{option}</span>{solved && i === task.answer && task.card && <span className="level-placed-card">{task.card}</span>}</button>)}</div>
        <div className={`level-feedback${confirmedNow ? " just-confirmed" : ""}${solved ? " success" : wrong !== null ? " hint" : ""}`} role="status" aria-live="polite" aria-atomic="true">{solved ? <><strong>✓ ¡Correcto!</strong><p>{task.explanation}</p></> : wrong !== null ? <><strong>Una pista para intentarlo otra vez</strong><p>{task.hint}</p></> : <p>{task.card && !selectedCard ? "Selecciona primero la tarjeta." : "Elige la respuesta correcta para continuar."}</p>}</div>
      </>)}

      {state.stage === reward && <>
        {newAward && <div className="level-confetti" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ "--i": i } as CSSProperties} />)}</div>}
        {newAward && <p className="level-award-earned" role="status">✓ Misión completada. Conseguiste {definition.badge}{unlockedResource ? ` y desbloqueaste ${unlockedResource.title}` : " y su infografía"}.</p>}
        <FirstLevelReward definition={definition} />
        {unlockedResource && onResource && <div className={`level-new-resource${newAward ? " is-new-award" : ""}`}><p className="game-kicker">{newAward ? "NUEVO RECURSO DESBLOQUEADO" : "RECURSO EN TU COLECCIÓN"}</p><h2>{unlockedResource.title}</h2><p>{unlockedResource.description}</p><button className="game-secondary" type="button" onClick={() => onResource(unlockedResource.id)}>Explorar mi hallazgo <span aria-hidden="true">↗</span></button></div>}
      </>}
    </div>
    <div className="level-actions">
      <button type="button" className="game-secondary" onClick={back}>{state.stage === 0 ? "Salir" : "← Anterior"}</button>
      <button type="button" className="game-primary" disabled={(state.stage === practice && !solved) || (exploringStatue && !statueComplete(state, definition))} onClick={state.stage === reward ? onNext : forward}>{state.stage === reward ? "Seguir en el mapa →" : state.stage === practice && state.task === firstLevelTasks.length - 1 ? "Recibir mi premio" : "Continuar →"}</button>
    </div>
        {state.stage === 1 && media && <details className="level-reading"><summary>Prefiero leer</summary>{firstLevelMedia.transcript ? <p className="level-transcript">{firstLevelMedia.transcript}</p> : <><p>Lectura de apoyo</p>{firstLevelReadings.map((part, i) => <section key={i}><h2>{part.title}</h2><p>{part.text}</p><BiblePassage reference={part.reference} /></section>)}</>}</details>}
    {state.stage === reward && definition.index < modules.length - 1 && <button className="game-text-button" type="button" onClick={onExit}>Elegir otra misión en el mapa →</button>}
    {previouslyCompleted && !state.claimed && <p className="level-preview-note">Tu logro anterior se conserva. Puedes repasar esta misión con las actividades actuales.</p>}
    <p className="level-save" aria-live="off">{saving ? "Guardando tu avance…" : persistent ? "Progreso guardado" : "No se pudo guardar tu progreso."}</p>
    <details className="level-reading"><summary>Fuentes y cuaderno de la misión</summary><p>Perspectiva adventista. Distingue el texto bíblico de su interpretación y verifica las respuestas con las fuentes originales.</p><ul>{study.sources.map((source) => <li key={source.label}>{source.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.label} ↗</a> : source.label}</li>)}</ul><a href={study.notebookUrl} target="_blank" rel="noreferrer">Abrir notebook completo ↗</a></details>
  </section>;
}
