"use client";

import { useState, type CSSProperties } from "react";
import { connectFirstLevel, firstLevelDefinition, type LevelDefinition, type FirstLevelProgress } from "../data/firstLevel";

export default function LevelMatching({ progress, onChange, definition = firstLevelDefinition }: { definition?: LevelDefinition; progress: FirstLevelProgress; onChange: (update: (state: FirstLevelProgress) => FirstLevelProgress) => void }) {
  const { pairs, pairOrder: order } = definition;
  const [selected, setSelected] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const matched = progress.matched ?? [];
  const complete = matched.length === pairs.length;
  function connect(destination: number) {
    if (selected === null || matched.includes(destination)) return;
    if (selected !== destination) { setWrong(destination); return; }
    onChange((state) => connectFirstLevel(state, selected, destination, definition));
    setSelected(null);
    setWrong(null);
  }
  return <>
    <p className="level-lead">Toca una tarjeta a la izquierda y después su descripción a la derecha.</p>
    <div className="level-matching" style={{ "--pair-count": pairs.length } as CSSProperties}>
      <div className="level-match-column" role="group" aria-label="Conceptos">
        {pairs.map((pair, i) => <button type="button" key={pair.passage} aria-pressed={selected === i} aria-disabled={matched.includes(i)} className={`${matched.includes(i) ? "correct" : selected === i ? "selected" : ""}`} onClick={() => { if (!matched.includes(i)) { setSelected(i); setWrong(null); } }}><span>{pair.passage}</span>{matched.includes(i) && <span className="level-match-check">✓ Pareja {i + 1}</span>}</button>)}
      </div>
      <svg className="level-match-lines" viewBox={`0 0 100 ${pairs.length * 100}`} preserveAspectRatio="none" aria-hidden="true">
        {matched.map((i) => <line key={i} x1="0" y1={50 + i * 100} x2="100" y2={50 + order.indexOf(i) * 100} />)}
        {selected !== null && wrong !== null && <line className="wrong" x1="0" y1={50 + selected * 100} x2="100" y2={50 + order.indexOf(wrong) * 100} />}
      </svg>
      <div className="level-match-column" role="group" aria-label="Descripciones">
        {order.map((i) => <button type="button" key={i} aria-disabled={selected === null || matched.includes(i)} className={matched.includes(i) ? "correct" : wrong === i ? "wrong" : ""} onClick={() => connect(i)}><span>{pairs[i].description}</span>{matched.includes(i) && <span className="level-match-check">✓ Pareja {i + 1}</span>}</button>)}
      </div>
    </div>
    <div className={`level-feedback${complete ? " success" : wrong !== null ? " hint" : ""}`} role="status" aria-live="polite" aria-atomic="true">
      <strong>{complete ? "✓ ¡Todas las parejas conectadas!" : `${matched.length} de ${pairs.length} parejas conectadas`}</strong>
      <p>{complete ? definition.tasks.find((task) => task.kind === "Conecta")?.explanation : wrong !== null && selected !== null ? `Esa conexión no corresponde. ${pairs[selected].hint}` : selected !== null ? `Busca la descripción de ${pairs[selected].passage}.` : "Selecciona una tarjeta para conectar su pareja."}</p>
    </div>
  </>;
}
