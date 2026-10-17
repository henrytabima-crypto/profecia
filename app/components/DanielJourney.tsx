"use client";

import Image from "next/image";
import BibleExcerpt from "./BibleExcerpt";
import { BiblePassage } from "./BibleReader";
import { Component, lazy, Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { JOURNEY_PARTS, JOURNEY_STEPS, journeyReducer, type JourneyState } from "../data/danielJourney";
import useQuickTransition from "../hooks/useQuickTransition";

const DanielStatue3D = lazy(() => import("./DanielStatue3D"));

type JourneyProps = {
  state: JourneyState;
  dispatch: (action: Parameters<typeof journeyReducer>[1]) => void;
  persistent: boolean;
  onContinue: () => void;
  missionCompleted?: boolean;
};

class JourneySceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function JourneyPath({ count }: { count: number }) {
  return (
    <ol className="journey-path" aria-label={`${count} de ${JOURNEY_STEPS.length} retos resueltos`}>
      {JOURNEY_STEPS.map((step, index) => (
        <li key={step.id} className={index < count ? "earned" : index === count ? "current" : ""}>
          <span aria-hidden="true">{index < count ? "✓" : String(index + 1).padStart(2, "0")}</span>
          <span className="visually-hidden">{step.title}: {index < count ? "resuelto" : index === count ? "actual" : "pendiente"}</span>
        </li>
      ))}
    </ol>
  );
}

export function JourneyEmblem() {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeOpacity=".3" />
      <path d="m50 7 5 9-5-2-5 2 5-9ZM50 93l-5-9 5 2 5-2-5 9ZM7 50l9-5-2 5 2 5-9-5ZM93 50l-9 5 2-5-2-5 9 5Z" fill="currentColor" />
      <path d="m50 21 19 10-5 19 9 28H27l9-28-5-19 19-10Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M33 39h34M36 51h28M32 64h36M50 64v14" stroke="currentColor" />
      <path d="m50 21 19 10-2 8H33l-2-8 19-10Z" fill="currentColor" fillOpacity=".2" />
    </svg>
  );
}

export default function DanielJourney({ state, dispatch, persistent, onContinue, missionCompleted = false }: JourneyProps) {
  const section = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const reading = useRef<HTMLHeadingElement>(null);
  const feedback = useRef<HTMLDivElement>(null);
  const coach = useRef<HTMLDivElement>(null);
  const orderOptions = useRef<HTMLDivElement>(null);
  const [sceneAvailable, setSceneAvailable] = useState<boolean | null>(null);
  const complete = state.step === JOURNEY_STEPS.length;
  const step = JOURNEY_STEPS[state.step];
  const count = Math.min(state.step + (state.solved ? 1 : 0), JOURNEY_STEPS.length);
  const transitionKey = `${state.step}:${state.solved}`;
  const instruction = useQuickTransition<HTMLDivElement>(transitionKey);
  const interaction = useQuickTransition<HTMLDivElement>(transitionKey);
  const guideIndex = state.helpEnabled && !state.solved && (state.step === 0 || state.showHint)
    ? state.step === 1 ? 1 : state.step === 0 ? 0 : null
    : null;
  const activeIndex = complete || state.step === 4 ? 5
    : state.solved ? state.step === 3 ? 2 : state.step
      : state.step === 3 ? (state.order.at(-1) ?? -1) : -1;

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- WebGL availability is a browser capability detected after mounting.
      setSceneAvailable(Boolean(context));
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setSceneAvailable(false);
    }
  }, []);

  useEffect(() => {
    (reading.current ?? title.current)?.focus({ preventScroll: true });
    section.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [state.step]);

  useEffect(() => {
    if (state.solved) {
      feedback.current?.focus({ preventScroll: true });
      feedback.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
    }
  }, [state.solved]);

  useEffect(() => {
    if (state.feedback === "incorrect") coach.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [state.feedback]);

  useEffect(() => {
    if (state.order.length === 0 || state.solved) return;
    const buttons = Array.from(orderOptions.current?.querySelectorAll<HTMLButtonElement>("button") ?? []);
    const lastChoice = buttons.findIndex((button) => Number(button.dataset.part) === state.order.at(-1));
    const next = [...buttons.slice(lastChoice + 1), ...buttons.slice(0, lastChoice)].find((button) => !button.disabled);
    next?.focus({ preventScroll: true });
  }, [state.order, state.solved]);

  const select = (index: number) => dispatch({ type: "select", index });

  return (
    <section ref={section} className="journey-inline" aria-labelledby="journey-title">
      <div className="journey-topbar">
        <span className="journey-wordmark"><span>MISIÓN 02 <i>/</i> EL SUEÑO DEL REY</span></span>
        <span className="journey-topbar-meta">Resuelve</span>
      </div>

      {complete ? (
        <div ref={instruction} className="journey-completion">
          <div className="journey-reward-art"><JourneyEmblem /><span>CARTA 01 · DANIEL 2</span></div>
          <div className="journey-completion-copy">
            <p className="journey-eyebrow">Pasaporte de explorador · Carta obtenida</p>
            <h2 id="journey-title" ref={title} tabIndex={-1}>El sueño tiene<br /><em>un horizonte.</em></h2>
            <p>Reconociste los materiales, conectaste los primeros reinos y descubriste hacia dónde apunta la piedra: el reino que Dios establece.</p>
            <JourneyPath count={count} />
            <div className="journey-reward-detail"><span aria-hidden="true">✦</span><div><strong>El sueño del rey</strong><small>5 retos resueltos · Observar, conectar y ordenar</small></div></div>
            <p className="journey-next-label">{missionCompleted ? "Tu estatua sigue disponible en la galería. Puedes continuar tu aventura desde el mapa." : "Completa esta misión para desbloquear la estatua en tu galería y continuar con la misión 3."}</p>
            <button type="button" className="journey-primary" onClick={onContinue}>{missionCompleted ? "Volver al mapa" : "Completar misión"} <span aria-hidden="true">→</span></button>
            <button type="button" className="journey-text-button" onClick={() => dispatch({ type: "replay" })}>Volver a practicar</button>
          </div>
        </div>
      ) : (
        <div className="journey-workspace">
          <div ref={instruction} className="journey-instruction">
            <div className="journey-step-meta"><span>El sueño del rey</span><span>Paso {state.step + 1} de {JOURNEY_STEPS.length}</span></div>
            <JourneyPath count={count} />
            <p className="journey-eyebrow">{state.step < 2 ? "Aprende explorando" : state.step === 3 ? "Conecta lo aprendido" : "Resuelve la conexión"}</p>
            <h2 id="journey-title" ref={title} tabIndex={-1}>{step.title}</h2>
            {!state.solved && <>
              <div className="journey-reading" aria-labelledby="journey-reading-title">
                <h3 ref={reading} id="journey-reading-title" tabIndex={-1}>Primero, lee y observa</h3>
                <BibleExcerpt reference={step.reference} />
                <div className="journey-reading-key"><span>Clave de lectura</span><p>{step.explanation}</p></div>
              </div>
              <p className="journey-challenge-label">Ahora, tu reto</p>
            </>}
            <p className="journey-instruction-copy">{state.solved ? "Descubre qué sostiene esta conexión y continúa cuando estés listo." : state.step === 0 && sceneAvailable === false ? "Encuentra la parte de oro y elige su material entre las opciones." : step.instruction}</p>
          </div>

          <div className={`journey-stage${step.kind !== "scene" || state.solved ? " is-reading" : ""}`}>
            <div className="journey-stage-caption"><span>VISIÓN · DANIEL 2</span><small>{step.kind === "scene" && !state.solved ? sceneAvailable === false ? "Elige el material entre las opciones" : "Toca una pieza o elige su material" : "Observa cómo se conectan los símbolos"}</small></div>
            {sceneAvailable === true ? (
              <JourneySceneBoundary onError={() => setSceneAvailable(false)}>
                <Suspense fallback={<div className="three-loading"><span />Preparando la estatua… Puedes usar las opciones.</div>}>
                  <DanielStatue3D activeIndex={activeIndex} guideIndex={guideIndex} guided onAssetError={() => setSceneAvailable(false)} onSelect={(index) => { if (step.kind === "scene") select(index); }} />
                </Suspense>
              </JourneySceneBoundary>
            ) : (
              <div className="journey-scene-fallback">
                <Image src="/3d-sources/daniel-statue-source-v1.png" alt="Estatua con cabeza de oro, pecho de plata, vientre de bronce, piernas de hierro y pies de hierro y barro." width={1024} height={1536} sizes="(max-width: 700px) 220px, 400px" />
                {state.step === 4 && <span className="journey-stone-symbol" aria-label="La piedra"><svg viewBox="0 0 100 80" aria-hidden="true"><path d="m8 65 12-38L47 8l33 16 13 38-35 12Z" fill="#bcb19a" stroke="#e4c98e" strokeWidth="2"/><path d="m20 27 29 14L80 24M49 41l9 33" fill="none" stroke="#80796c" strokeWidth="2"/></svg></span>}
              </div>
            )}
            <div className="journey-stage-footnote">{sceneAvailable === false ? "Puedes completar el reto con las opciones." : "Una visión. Un paso a la vez."}</div>
          </div>

          <div ref={interaction} className="journey-interaction">
            {state.solved ? (
              <div ref={feedback} className="journey-feedback success" tabIndex={-1}>
                <span className="journey-feedback-label"><i aria-hidden="true">✓</i> Conexión descubierta</span>
                <h3>{step.successTitle}</h3>
                <p>{step.explanation}</p>
                <BiblePassage className="journey-reference" reference={step.reference}>{step.reference} <span aria-hidden="true">Leer el pasaje</span></BiblePassage>
                <button type="button" className="journey-primary" onClick={() => dispatch({ type: "advance" })}>{state.step === JOURNEY_STEPS.length - 1 ? "Recibir mi carta" : "Seguir explorando"} <span aria-hidden="true">→</span></button>
              </div>
            ) : (
              <>
                {step.kind === "scene" && (
                  <div className="journey-materials" role="group" aria-label="Seleccionar un material de la estatua">
                    {JOURNEY_PARTS.slice(0, 3).map((part) => (
                      <button type="button" key={part.index} className={`journey-material material-${part.index}${guideIndex === part.index ? " guided" : ""}`} onClick={() => select(part.index)}>
                        <i aria-hidden="true" /><strong>{part.material}</strong><span>{part.part}</span>
                        {guideIndex === part.index && <small>{state.step === 0 ? "Empieza aquí" : "Mira aquí"} <span aria-hidden="true">↖</span></small>}
                      </button>
                    ))}
                  </div>
                )}
                {step.kind === "choice" && (
                  <div className="journey-choices" role="group" aria-label="Elige una respuesta">
                    {step.options?.map((option, index) => (
                      <button type="button" key={option.index} onClick={() => select(option.index)}><span>{String.fromCharCode(65 + index)}</span>{option.label}<i aria-hidden="true">→</i></button>
                    ))}
                  </div>
                )}
                {step.kind === "order" && (
                  <div className="journey-order">
                    <div className="journey-order-slots" role="group" aria-label="Secuencia de los primeros tres reinos">
                      {[0, 1, 2].map((position) => <div key={position} className={state.order[position] !== undefined ? "filled" : ""}><span>{position + 1}</span><strong>{state.order[position] !== undefined ? JOURNEY_PARTS[state.order[position]].name : "Por descubrir"}</strong></div>)}
                    </div>
                    <p className="journey-order-prompt" role="status">{state.order.length === 0 ? "Toca el reino que va primero." : `Bien. Ahora elige el ${state.order.length === 1 ? "segundo" : "tercero"}.`}</p>
                    <div ref={orderOptions} className="journey-order-options" role="group" aria-label="Reinos disponibles">
                      {[2, 0, 1].map((index) => <button type="button" key={index} data-part={index} disabled={state.order.includes(index)} onClick={() => select(index)}>{state.order.includes(index) && <span aria-hidden="true">✓ </span>}{JOURNEY_PARTS[index].name}</button>)}
                    </div>
                  </div>
                )}
                <div ref={coach} className="journey-coach" aria-live="polite" aria-atomic="true">
                  {state.showHint || (state.helpEnabled && state.step === 0) ? <p><span aria-hidden="true">✧</span><span>{state.feedback === "incorrect" && <strong>Prueba otra vez. </strong>}{step.hint}</span></p> : <p className="journey-coach-idle">{state.helpEnabled ? "Cada elección te ayuda a descubrir la siguiente conexión." : "Explora a tu ritmo. Puedes pedir una pista."}</p>}
                </div>
                <div className="journey-help-actions">
                  <button type="button" className="journey-text-button" onClick={() => dispatch({ type: "hint" })} disabled={state.showHint}>Ver una pista</button>
                  <button type="button" className="journey-text-button" onClick={() => dispatch({ type: "toggle-help" })} aria-pressed={state.helpEnabled}>{state.helpEnabled ? "Omitir ayudas iniciales" : "Activar ayudas"}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <div className="journey-bottom-bar"><span>{persistent ? "Tu avance se guarda en este dispositivo." : "El navegador no permite guardar. Tu avance se conserva mientras esta página esté abierta."}</span></div>
    </section>
  );
}
