"use client";

import { Component, lazy, Suspense, useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { empireLayers } from "../data/statueExploration";

const DanielStatue3D = lazy(() => import("./DanielStatue3D"));
class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function StatueExploration({ active, explored, onSelect, children }: { children: ReactNode; active: number; explored: number[]; onSelect: (index: number) => void }) {
  const [available, setAvailable] = useState<boolean | null>(null);
  useEffect(() => {
    let supported = false;
    try {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      supported = Boolean(context);
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { /* The labeled buttons also work without WebGL. */ }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Detect browser-only graphics support after hydration.
    setAvailable(supported);
  }, []);
  return <div className="level-statue-exploration">
    <p className="level-lead">Toca cada parte de la estatua o elige su nombre para descubrir su significado. Tu progreso se guarda al explorar.</p>
    <div className="level-statue-progress">
      <p role="status">{explored.length} de {empireLayers.length} partes exploradas{explored.length === empireLayers.length ? ". Ya puedes continuar." : ""}</p>
      <progress aria-label="Partes exploradas" value={explored.length} max={empireLayers.length} />
    </div>
    <div className="level-statue-scene">
      {available === true && <SceneBoundary onError={() => setAvailable(false)}><Suspense fallback={<p role="status">Preparando la estatua…</p>}><DanielStatue3D activeIndex={active} onSelect={onSelect} onAssetError={() => setAvailable(false)} /></Suspense></SceneBoundary>}
      {available === null && <p role="status">Preparando la estatua…</p>}
      {available === false && <Image src="/3d-sources/daniel-statue-source-v1.png" alt="Estatua de Daniel: cabeza de oro, pecho de plata, vientre de bronce, piernas de hierro y pies de hierro y barro." width={1024} height={1536} sizes="300px" />}
    </div>
    <div className="level-statue-parts" role="group" aria-label="Partes de la estatua">
      {empireLayers.map((part, i) => <button key={part.id} type="button" aria-pressed={active === i} onClick={() => onSelect(i)}><span>{part.part} · {part.material}</span><span>{explored.includes(i) ? "✓ Explorada" : "Por explorar"}</span></button>)}
    </div>
    {children}
  </div>;
}
