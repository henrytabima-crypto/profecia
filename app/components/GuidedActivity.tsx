"use client";

import { useEffect, useId, useRef } from "react";
import type { GuideActivity } from "../data/missionGuides";
import type { GuideProgress } from "../data/guidedProgress";
import { BiblePassage } from "./BibleReader";
import BibleExcerpt from "./BibleExcerpt";
import useQuickTransition from "../hooks/useQuickTransition";

type GuidedActivityProps = {
  activity: GuideActivity;
  progress: GuideProgress;
  helpEnabled: boolean;
  teachFirstChoice: boolean;
  onChoose: (index: number) => void;
  onHint: () => void;
  onToggleHelp: () => void;
  onContinue: () => void;
  continueLabel: string;
};

export default function GuidedActivity({
  activity,
  progress,
  helpEnabled,
  teachFirstChoice,
  onChoose,
  onHint,
  onToggleHelp,
  onContinue,
  continueLabel,
}: GuidedActivityProps) {
  const id = useId();
  const reading = useRef<HTMLHeadingElement>(null);
  const completion = useRef<HTMLDivElement>(null);
  const coach = useRef<HTMLDivElement>(null);
  const currentRound = Math.min(progress.solved.length, activity.rounds.length);
  const complete = currentRound === activity.rounds.length;
  const round = activity.rounds[currentRound];
  const previousRound = currentRound > 0 ? activity.rounds[currentRound - 1] : null;
  const firstChoice = teachFirstChoice && helpEnabled && currentRound === 0;
  const showHint = progress.showHint || progress.wrong;
  const content = useQuickTransition<HTMLDivElement>(currentRound);

  useEffect(() => {
    const target = complete ? completion.current : reading.current;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: complete ? "nearest" : "start", behavior: "instant" });
  }, [activity.title, currentRound, complete]);

  useEffect(() => {
    if (progress.wrong || progress.showHint) coach.current?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [progress.wrong, progress.showHint]);

  return (
    <section className="guided-activity" aria-labelledby={`${id}-title`}>
      <div className="guided-heading">
        <div>
          <p className="guided-kicker">{complete ? "Conexiones reunidas" : "Aprende con cada elección"}</p>
          <h2 id={`${id}-title`}>{activity.title}</h2>
        </div>
        <span className="guided-count">{currentRound}<span> / {activity.rounds.length}</span><small>conexiones</small></span>
      </div>
      <ol className="guided-progress" aria-label={`${currentRound} de ${activity.rounds.length} conexiones reconocidas`}>
        {activity.rounds.map((item, index) => (
          <li key={`${index}-${item.prompt}`} className={index < currentRound ? "earned" : index === currentRound ? "current" : ""}>
            <span aria-hidden="true">{index < currentRound ? "✓" : index + 1}</span>
            <span className="visually-hidden">Reto {index + 1}: {index < currentRound ? "resuelto" : index === currentRound ? "actual" : "pendiente"}</span>
          </li>
        ))}
      </ol>

      <div ref={content} className="guided-content">
      {complete ? (
        <div ref={completion} className="guided-completion" role="group" tabIndex={-1} aria-labelledby={`${id}-completion-title`}>
          <div className="guided-completion-heading"><span aria-hidden="true">✓</span><div><h3 id={`${id}-completion-title`}>Ya puedes seguir</h3><p>Estas son las conexiones que acabas de reconocer.</p></div></div>
          <ol className="guided-recap">
            {activity.rounds.map((item, index) => (
              <li key={`${index}-${item.prompt}`}><span className="guided-recap-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><p>{item.explanation}</p>{item.reference && <BiblePassage reference={item.reference} className="guided-reference" />}</div></li>
            ))}
          </ol>
          <div className="guided-actions"><button type="button" className="game-primary guided-continue" onClick={onContinue}>{continueLabel}<span aria-hidden="true">→</span></button></div>
        </div>
      ) : (
        <>
          {helpEnabled && <p className="guided-instruction" id={`${id}-instruction`}>{activity.instruction}</p>}
          {previousRound && <p key={currentRound} className="guided-recognized" role="status"><i aria-hidden="true">✓</i> Conexión anterior resuelta. Ahora descubre la siguiente.</p>}
          <div className="guided-reading">
            <h3 ref={reading} tabIndex={-1}>Primero, lee y descubre</h3>
            <BibleExcerpt reference={round.reference} label={round.referenceLabel} />
            <div className="guided-reading-key"><p className="guided-kicker">{round.preparationLabel ?? "Clave de lectura"}</p><p>{round.preparation ?? round.explanation}</p></div>
          </div>
          <div className="guided-round">
            <p className="guided-round-label">Ahora, tu reto · {currentRound + 1} de {activity.rounds.length}</p>
            <h3 id={`${id}-prompt`}>{round.prompt}</h3>
            <div className="guided-options" role="group" aria-labelledby={`${id}-prompt`}>
              {round.options.map((option, index) => {
                const highlighted = firstChoice && index === round.answer;
                return (
                  <button type="button" key={`${currentRound}-${index}`} className={highlighted ? "guided-option is-taught" : "guided-option"} onClick={() => onChoose(index)}>
                    <span className="guided-option-letter" aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                    <span className="guided-option-copy">{option}{highlighted && <small>Empieza aquí <span aria-hidden="true">↖</span></small>}</span>
                    <span className="guided-option-arrow" aria-hidden="true">→</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div ref={coach} className={`guided-coach${showHint ? " has-hint" : ""}`} role="status" aria-live="polite" aria-atomic="true">
            {showHint ? <p><span aria-hidden="true">✧</span><span>{progress.wrong && <strong>Prueba otra vez. </strong>}{round.hint}</span></p> : <p className="guided-coach-idle">{!helpEnabled ? "Puedes pedir una pista cuando la necesites." : firstChoice ? "Elige la opción marcada. Así descubrirás cómo avanzar." : "Cada acierto prepara el siguiente reto. Puedes pedir una pista."}</p>}
          </div>
          <div className="guided-actions guided-help-actions">
            <button type="button" className="guided-text-button" onClick={onHint} disabled={showHint}>Ver una pista</button>
            <button type="button" className="guided-text-button" onClick={onToggleHelp} aria-pressed={helpEnabled}>{helpEnabled ? "Omitir ayudas iniciales" : "Activar ayudas"}</button>
          </div>
        </>
      )}
      </div>
    </section>
  );
}
