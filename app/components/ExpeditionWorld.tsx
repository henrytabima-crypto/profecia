"use client";

import { useId, useLayoutEffect, useRef, type CSSProperties, type KeyboardEvent } from "react";
import { missionExperience, resumeLesson, stageComplete, type AwardTransition } from "../data/expedition";
import { levelProgress, type Journey } from "../data/journey";
import { levelDefinitions } from "../data/levels";
import { modules } from "../data/studies";

const stops = [{ x: 42, y: 1550 }, { x: 65, y: 1370 }, { x: 44, y: 1190 }, { x: 28, y: 1010 }, { x: 58, y: 830 }, { x: 70, y: 650 }, { x: 42, y: 470 }, { x: 52, y: 290 }];
const road = "M 42 1760 L 42 1550 C 42 1460 65 1460 65 1370 S 44 1280 44 1190 S 28 1100 28 1010 S 58 920 58 830 S 70 740 70 650 S 42 560 42 470 S 52 380 52 290 L 52 170";

export function ExpeditionIcon({ kind }: { kind: "map" | "gallery" | "options" | "compass" }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === "map" ? <><path d="m3 7 8-3 10 4 8-3v22l-8 3-10-4-8 3zM11 4v22M21 8v22" /><path d="m15 12 3 3-3 3" /></>
      : kind === "gallery" ? <><path d="M5 7h22v21H5zM10 3h12M9 23l5-6 4 4 4-7 3 9" /><circle cx="11" cy="12" r="2" /></>
      : kind === "options" ? <><path d="M5 8h22M5 16h22M5 24h22" /><circle cx="11" cy="8" r="3" fill="currentColor" /><circle cx="22" cy="16" r="3" fill="currentColor" /><circle cx="13" cy="24" r="3" fill="currentColor" /></>
      : <><circle cx="16" cy="16" r="13" /><path d="m22 10-4 8-8 4 4-8z" /><circle cx="16" cy="16" r="1" /></>}
  </svg>;
}

function Tree({ gold = false }: { gold?: boolean }) {
  return <svg viewBox="0 0 90 140" aria-hidden="true"><path d="M42 80h9v57h-9z" fill="#314451" /><path d="m45 5 34 54H62l24 35H57l20 26H9l20-26H3l24-35H11z" fill={gold ? "#d2a85e" : "#368c80"} /><path d="m45 5 4 115H9l20-26H3l24-35H11z" fill={gold ? "#edc27b" : "#50ab92"} /><path d="M47 23v88M47 59l18 20M45 78 26 99" stroke={gold ? "#f1d6a0" : "#72c5ab"} strokeWidth="2" opacity=".6" /></svg>;
}

function Landmark({ kind }: { kind: "gate" | "sanctuary" | "tower" | "city" }) {
  return <svg viewBox="0 0 220 180" aria-hidden="true">
    <ellipse cx="110" cy="159" rx="104" ry="17" fill="#051e3930" />
    {kind === "gate" ? <>
      <path d="M15 139 32 116l163 2 15 23-20 24H30z" fill="#4b767e" /><path d="M49 43h125v108H49z" fill="#aa9071" /><path d="M44 36h135v16H44z" fill="#e4c48b" /><path d="M71 76c0-54 81-54 81 0v76H71z" fill="#173849" /><path d="M80 78c0-41 63-41 63 0v74H80z" fill="#e5b873" /><path d="M89 86c0-36 45-36 45 0v66H89z" fill="#f5d793" /><path d="M42 18h24v133H42zM156 18h25v133h-25z" fill="#c6aa82" /><path d="M36 13h37v13H36zM150 13h37v13h-37z" fill="#ead09b" /><path d="M61 154h103v9H61zM71 145h83v9H71z" fill="#e5c291" /><path d="M49 50h13M50 87h12M160 66h15M160 106h15" stroke="#8c755d" strokeWidth="3" /><path d="M98 43h27M111 31v24" stroke="#f8e6b9" strokeWidth="2" />
    </> : kind === "sanctuary" ? <>
      <path d="m13 139 99-19 94 20-30 30H41z" fill="#70a69b" /><path d="M35 70h148v80H35z" fill="#e0c494" /><path d="m23 69 88-39 88 39z" fill="#f4daab" /><path d="m38 66 72-27 74 27z" fill="#b79568" /><path d="M54 78h15v64H54zM149 78h15v64h-15z" fill="#f5ddb6" /><path d="M44 74h134v8H44zM44 139h134v9H44z" fill="#b29269" /><path d="M81 83h57v61H81z" fill="#7b5d5c" /><path d="M107 83h5v61h-5z" fill="#efd09b" /><path d="M111 32V14" stroke="#eace94" strokeWidth="3" /><circle cx="111" cy="12" r="5" fill="#ffe3a7" /><path d="M26 149h171v9H26zM37 141h150v8H37z" fill="#f1d8ab" /><path d="M8 120h25v25H8z" fill="#c7925a" /><path d="M13 120c-7-8 8-10 7-23 17 17 6 18 5 23" fill="#f6cd71" />
    </> : kind === "tower" ? <>
      <path d="M38 63h69v87H38z" fill="#b9a481" /><path d="M29 61h86L74 29z" fill="#49778b" /><path d="M51 60h45v8H51z" fill="#e6c58b" /><path d="M60 78a12 12 0 0 1 24 0v17H60zM60 122a12 12 0 0 1 24 0v29H60z" fill="#355e71" /><path d="M103 99h78v52h-78z" fill="#d7b993" /><path d="m95 101 49-32 48 32z" fill="#648e98" /><path d="M116 110h16v19h-16zM151 110h17v19h-17z" fill="#f3d593" /><path d="M29 151h166v11H29z" fill="#8bb4aa" /><path d="M144 29v31M127 44h34" stroke="#ecd09a" strokeWidth="3" /><circle cx="144" cy="44" r="20" fill="none" stroke="#d5b97d" strokeWidth="2" /><circle cx="144" cy="44" r="13" fill="none" stroke="#d5b97d" strokeWidth="1" />
    </> : <>
      <path d="M23 84h173v64H23z" fill="#f3d69c" /><path d="M34 50h30v98H34zM154 48h30v100h-30zM88 36h43v112H88z" fill="#e8c787" /><path d="m30 50 20-29 20 29zM150 48l20-31 20 31zM82 36l28-34 28 34z" fill="#fff0c6" /><path d="M97 88c0-22 25-22 25 0v59H97z" fill="#86b9ad" /><path d="M44 70h10v17H44zM164 68h10v17h-10zM97 46h9v13h-9zM116 46h9v13h-9zM37 108h10v18H37zM172 108h10v18h-10z" fill="#a0c7b3" /><path d="M10 149h199v9H10zM35 159h149v10H35z" fill="#cce3c4" /><path d="M110 2V-7M103-1h14" stroke="#fff7db" strokeWidth="3" />
    </>}
  </svg>;
}

function WorldLandscape() {
  const id = useId().replace(/:/g, "");
  return <div className="world-landscape" aria-hidden="true">
    <svg className="world-terrain" viewBox="0 0 800 1740" preserveAspectRatio="none">
      <defs><linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#c0ddcd" /><stop offset=".28" stopColor="#548d9e" /><stop offset=".64" stopColor="#326b76" /><stop offset="1" stopColor="#223a61" /></linearGradient><linearGradient id={`${id}-land`} x2="0" y2="1"><stop stopColor="#78aa8f" /><stop offset=".5" stopColor="#398a7c" /><stop offset="1" stopColor="#20465c" /></linearGradient></defs>
      <path d="M0 0h800v1740H0z" fill={`url(#${id}-sky)`} />
      <circle cx="420" cy="70" r="110" fill="#fce6b550" /><circle cx="420" cy="70" r="67" fill="#ffe6a9" />
      <path d="M0 170 100 39 200 170 313 101 399 199 501 102 610 161 718 65 800 170v224H0z" fill="#689f9d" /><path d="m66 85 34-46 51 69-47-16zM660 129l58-64 49 58-47-11z" fill="#d6e5d0" />
      <path d="M0 240c90-170 160-25 272-58s239-29 309 30 155-2 219-15v1543H0z" fill={`url(#${id}-land)`} />
      <path d="M0 357c100-49 177 74 280 53s177-7 283 49 160-74 237-18v113c-152 32-221 58-342-4S189 514 0 530z" fill="#a0c49d" opacity=".3" />
      <path d="M0 650c166-98 232 40 342 5s269-90 458-27v58c-185-60-346 51-444 8S159 607 0 698z" fill="#8bcebf" opacity=".5" />
      <path d="M0 965c174-19 221 153 386 138s249-46 414 29v111c-138-48-267-75-407-40S155 1136 0 1156z" fill="#336b78" />
      <path d="M0 1160c131-104 250 15 310 32s244 103 490 39v55c-196 54-355-2-498-48S132 1105 0 1216z" fill="#73aeb3" opacity=".6" />
      <path d="M0 1435c112-39 198-134 314-74s193 29 259 74 145 17 227-9v314H0z" fill="#273e60" />
      <path d="M0 1590c115-84 148-2 267-17s141-72 239-56 230 68 294 3v220H0z" fill="#253f58" />
      <g fill="#e0dbb5" opacity=".65"><path d="m75 290 11-4 7 4-11 5zM653 423l13-4 8 5-12 4zM92 695l12-4 8 5-12 5zM632 971l15-5 9 6-16 5zM113 1222l13-6 8 6-13 4zM545 1573l13-5 8 6-13 5z" /></g>
      <g fill="#f1e4c0"><circle cx="140" cy="1460" r="2" /><circle cx="620" cy="1500" r="2" /><circle cx="690" cy="1640" r="2" /><circle cx="90" cy="1672" r="2" /><path d="m674 1365 3 8 8 3-8 3-3 8-3-8-8-3 8-3zM158 1529l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" /></g>
    </svg>
    <div className="world-landmark landmark-city"><Landmark kind="city" /></div>
    <div className="world-landmark landmark-tower"><Landmark kind="tower" /></div>
    <div className="world-landmark landmark-sanctuary"><Landmark kind="sanctuary" /></div>
    <div className="world-landmark landmark-gate"><Landmark kind="gate" /></div>
    {Array.from({ length: 16 }, (_, i) => <div className={`world-tree tree-${i % 3}`} key={i} style={{ left: `${i % 2 ? 81 - i % 5 : 7 + i % 5}%`, top: `${230 + i * 89}px` }}><Tree gold={i > 12} /></div>)}
    <div className="world-region region-hope"><span>08 · EL HORIZONTE</span><strong>Una tierra nueva</strong></div>
    <div className="world-region region-visions"><span>03–05 · LAS VISIONES</span><strong>El camino de la promesa</strong></div>
    <div className="world-region region-origin"><span>01–02 · EL COMIENZO</span><strong>La primera luz</strong></div>
  </div>;
}

type Props = { arrival?: AwardTransition | null; journey: Journey; selectedIndex: number; ready: boolean; onOpen: (index: number) => void };

export default function ExpeditionWorld({ arrival, journey, selectedIndex, ready, onOpen }: Props) {
  const resume = resumeLesson(journey);
  const shortJourney = arrival && Math.abs(stops[arrival.from].y - stops[arrival.to].y) <= 360;
  const motionStart = shortJourney && arrival ? arrival.from : selectedIndex;
  const initialIndex = useRef(motionStart);
  const scroller = useRef<HTMLDivElement>(null);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      nodes.current[initialIndex.current]?.scrollIntoView({ block: "center", behavior: "instant" });
      nodes.current[arrival?.to ?? initialIndex.current]?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
    // Selection is handled in place; only entering the world centers the saved mission.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Consume the transient arrival once when entering the world.
  }, []);

  function keyboard(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const target = event.key === "ArrowUp" || event.key === "ArrowRight" ? Math.min(7, index + 1)
      : event.key === "ArrowDown" || event.key === "ArrowLeft" ? Math.max(0, index - 1)
      : event.key === "Home" ? 0 : event.key === "End" ? 7 : null;
    if (target !== null) { event.preventDefault(); nodes.current[target]?.focus(); nodes.current[target]?.scrollIntoView({ block: "center", behavior: "instant" }); }
  }

  return <section className="expedition-world" aria-labelledby="map-title">
    <h1 id="map-title" className="level-sr">Tu expedición: mapa de ocho misiones</h1>
    {arrival ? <div className="world-arrival-status" role="status"><strong>✓ Misión {modules[arrival.from].number} completada</strong><span>{journey.completed.length === modules.length ? "Tu expedición está completa. Todos tus hallazgos siguen disponibles." : `Tu siguiente paso: ${modules[arrival.to].title}`}</span></div> : <p className="world-hint">Desliza para explorar · Toca una misión</p>}
    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- The illustrated world is a keyboard-scrollable region. */}
    <div ref={scroller} className="world-scroll" tabIndex={0} role="region" aria-label="Mundo de la expedición. Las misiones avanzan desde abajo hacia arriba.">
      <div className="world-canvas">
        <WorldLandscape />
        <svg className="world-road" viewBox="0 0 100 1740" preserveAspectRatio="none" aria-hidden="true"><path d={road} className="road-shadow" /><path d={road} className="road-border" /><path d={road} className="road-surface" /><path d={road} className="road-stitch" />{arrival && shortJourney && arrival.from !== arrival.to && <path pathLength={1} className="road-progress-reveal" d={`M ${stops[arrival.from].x} ${stops[arrival.from].y} C ${stops[arrival.from].x} ${(stops[arrival.from].y + stops[arrival.to].y) / 2} ${stops[arrival.to].x} ${(stops[arrival.from].y + stops[arrival.to].y) / 2} ${stops[arrival.to].x} ${stops[arrival.to].y}`} />}</svg>
        <ol className="world-missions" aria-label="Misiones del mapa">{modules.map((mission, index) => {
          const status = missionExperience(journey, index);
          const progress = levelProgress(journey, index);
          const definition = levelDefinitions[index];
          const milestones = [status.complete || [0, 1].every((stage) => stageComplete(progress, definition, stage)), status.complete || (stageComplete(progress, definition, 2) && (!definition.exploration || stageComplete(progress, definition, 3))), status.complete];
          return <li key={mission.id} style={{ left: `${stops[index].x}%`, top: `${stops[index].y}px`, "--mission-progress": `${status.percent * 3.6}deg` } as CSSProperties} className={`world-stop${status.complete ? " is-complete" : ""}${selectedIndex === index ? " is-selected" : ""}${resume === index ? " is-resume" : ""}${arrival?.from === index ? " is-new-complete" : ""}${arrival?.to === index ? " is-arrival-target" : ""}`}>
            {resume === index && !arrival && <div className="world-traveler" aria-hidden="true"><ExpeditionIcon kind="compass" /><span>Tú</span></div>}
            <button ref={(element) => { nodes.current[index] = element; }} type="button" className="world-node" disabled={!ready} aria-label={`Misión ${mission.number}: ${mission.title}. ${status.complete ? "Completada" : status.started ? `En curso, ${status.percent}%` : "Disponible"}${resume === index ? ". Tu siguiente paso" : ""}`} onKeyDown={(event) => keyboard(event, index)} onClick={() => onOpen(index)}><span>{index + 1}</span>{status.complete && <i aria-hidden="true">✓</i>}</button>
            <span className="world-stars" role="img" aria-label={`${milestones.filter(Boolean).length} de 3 hitos conseguidos`}>{milestones.map((done, i) => <span key={i} className={done ? "earned" : ""} aria-hidden="true">★</span>)}</span>
            <span className="world-node-title" aria-hidden="true">{mission.title}</span>
          </li>;
        })}</ol>
        {arrival && <div className={`world-moving-traveler${shortJourney ? "" : " is-long-return"}`} style={{ "--from-x": `${stops[arrival.from].x}%`, "--from-y": `${stops[arrival.from].y - 111}px`, "--to-x": `${stops[arrival.to].x}%`, "--to-y": `${stops[arrival.to].y - 111}px` } as CSSProperties} aria-hidden="true"><div className="world-traveler"><ExpeditionIcon kind="compass" /><span>Tú</span></div></div>}
        <p className="world-end-note">Cristo, centro del relato.<br />Cada paso abre una nueva mirada.</p>
      </div>
    </div>
    <button className="world-recenter" type="button" aria-label="Volver a mi siguiente misión" onClick={() => { nodes.current[resume]?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" }); nodes.current[resume]?.focus({ preventScroll: true }); }}><ExpeditionIcon kind="compass" /></button>
  </section>;
}
