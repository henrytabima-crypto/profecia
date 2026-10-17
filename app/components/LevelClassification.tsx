"use client";

import { useRef, useState } from "react";
import { classifyLevelCard, type FirstLevelProgress, type LevelDefinition } from "../data/firstLevel";

export default function LevelClassification({ definition, progress, onChange }: {
  definition: LevelDefinition;
  progress: FirstLevelProgress;
  onChange: (update: (state: FirstLevelProgress) => FirstLevelProgress) => void;
}) {
  const task = definition.tasks[progress.task];
  const activity = task.classification!;
  const placed = progress.classified?.[progress.task] ?? [];
  const [selected, setSelected] = useState<number | null>(null);
  const [wrong, setWrong] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const destinations = useRef<HTMLDivElement>(null);
  const complete = activity.cards.every((_, i) => placed.includes(i));
  const dragPrefix = `classification:${definition.index}:${progress.task}:`;

  function place(cardIndex: number, category: number) {
    const card = activity.cards[cardIndex];
    if (!card || placed.includes(cardIndex)) return;
    setSelected(cardIndex);
    if (card.category !== category) {
      setWrong(category);
      setFeedback(`Esa tarjeta va en otra categoría. ${card.hint}`);
      return;
    }
    onChange((state) => classifyLevelCard(state, progress.task, cardIndex, category, definition));
    setSelected(null);
    setWrong(null);
    setFeedback(`✓ Tarjeta colocada en ${activity.categories[category]}.`);
  }

  return <>
    <p className="level-lead">Reparte las tarjetas entre las dos categorías. Toca una tarjeta y después su categoría, o arrástrala.</p>
    <div ref={destinations} className="level-sort-categories">
      {activity.categories.map((category, i) => <div key={category} className={`level-sort-category${wrong === i ? " wrong" : ""}`} role="group" aria-label={category}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const data = event.dataTransfer.getData("text/plain");
          if (data.startsWith(dragPrefix) && /^\d+$/.test(data.slice(dragPrefix.length))) place(Number(data.slice(dragPrefix.length)), i);
        }}>
        <button type="button" className="level-sort-destination" aria-disabled={selected === null || complete} onClick={() => { if (selected !== null) place(selected, i); }}>
          <span>{category}</span><span>{complete ? "✓ Completada" : "Colocar aquí"}</span>
        </button>
        <ul aria-label={`Tarjetas en ${category}`}>
          {placed.filter((n) => activity.cards[n]?.category === i).map((n) => <li key={n}><span aria-hidden="true">✓ </span>{activity.cards[n].text}</li>)}
        </ul>
      </div>)}
    </div>
    <div className={`level-feedback${complete ? " success" : wrong !== null ? " hint" : ""}`} role="status" aria-live="polite" aria-atomic="true">
      <strong>{complete ? "✓ ¡Todas las tarjetas en su lugar!" : `${placed.length} de ${activity.cards.length} tarjetas clasificadas`}</strong>
      <p>{complete ? task.explanation : feedback || "Selecciona una tarjeta para empezar."}</p>
    </div>
    {!complete && <div className="level-sort-bank" role="group" aria-label="Tarjetas por clasificar">
      {activity.cards.map((card, i) => !placed.includes(i) && <button key={i} type="button" draggable
        aria-pressed={selected === i} className={`level-sort-card${selected === i ? " selected" : ""}`}
        onDragStart={(event) => { event.dataTransfer.setData("text/plain", `${dragPrefix}${i}`); event.dataTransfer.effectAllowed = "move"; setSelected(i); setWrong(null); setFeedback(""); }}
        onClick={() => { setSelected(i); setWrong(null); setFeedback("Ahora toca la categoría que corresponde."); destinations.current?.scrollIntoView({ block: "nearest", behavior: "instant" }); }}>
        {card.text}
      </button>)}
    </div>}
  </>;
}
