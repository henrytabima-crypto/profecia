"use client";

import { BiblePassage } from "./BibleReader";

import {
  revelationBands,
  revelationClimax,
  revelationPanoramaItems,
  revelationSeries,
  type RevelationView,
} from "../data/revelation";

type RevelationPanoramaProps = {
  activeId: string;
  view: RevelationView;
  onSelect: (id: string) => void;
  onViewChange: (view: RevelationView) => void;
};

export default function RevelationPanorama({
  activeId,
  view,
  onSelect,
  onViewChange,
}: RevelationPanoramaProps) {
  const activePanoramaItem = revelationPanoramaItems.find((item) => item.id === activeId);
  const activeBands = new Set(activePanoramaItem?.bands ?? []);

  return (
    <div className="messages-scene revelation-scene">
      <div className="scene-caption revelation-scene-caption">
        <div>
          <span>{view === "panorama" ? "MAPA · APOCALIPSIS 1–11" : "DESENLACE · APOCALIPSIS 13–14"}</span>
          <small>{view === "panorama" ? "Compara sin forzar equivalencias" : "Contrasta presión y proclamación"}</small>
        </div>
        <div className="scene-mode-switch revelation-view-switch" role="tablist" aria-label="Vista de Apocalipsis">
          <button
            className={view === "panorama" ? "active" : ""}
            type="button"
            role="tab"
            aria-selected={view === "panorama"}
            onClick={() => onViewChange("panorama")}
          >Panoramas</button>
          <button
            className={view === "climax" ? "active" : ""}
            type="button"
            role="tab"
            aria-selected={view === "climax"}
            onClick={() => onViewChange("climax")}
          >Desenlace 13–14</button>
        </div>
      </div>

      <div className="revelation-viewport">
        {view === "panorama" ? (
          <div className="revelation-panorama-view" role="tabpanel">
            <div className="revelation-guide">
              <div>
                <span>REPETICIÓN Y AMPLIACIÓN</span>
                <strong>Tres panoramas, una historia</strong>
              </div>
              <p>Cada fila recorre la era cristiana con una cámara distinta. El brillo une franjas aproximadas, no números equivalentes.</p>
            </div>

            <div className="panorama-scroll" role="region" aria-label="Panorama paralelo de las iglesias, los sellos y las trompetas">
              <div className="panorama-map">
                <div className="panorama-axis" aria-label="Franjas históricas orientativas">
                  <div className="panorama-axis-label"><span>≈</span> Franjas orientativas</div>
                  <div className="panorama-axis-bands">
                    {revelationBands.map((band) => (
                      <span className={activeBands.has(band.id) ? "active" : ""} key={band.id} title={band.title}>
                        <i>{band.id}</i><b>{band.short}</b>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="panorama-lanes">
                  {revelationSeries.map((series) => (
                    <section className={`panorama-lane lane-${series.id}`} key={series.id} aria-labelledby={`lane-title-${series.id}`}>
                      <header>
                        <span>{series.number}</span>
                        <strong id={`lane-title-${series.id}`}>{series.title}</strong>
                        <small>{series.lens}</small>
                        <em>{series.context}</em>
                        {series.interlude && <i>Interludio · {series.interlude}</i>}
                      </header>
                      <ol aria-label={`${series.title}: siete escenas`}>
                        {series.items.map((item) => {
                          const isActive = activeId === item.id;
                          const isRelated = !isActive && item.bands?.some((band) => activeBands.has(band));
                          return (
                            <li key={item.id}>
                              <button
                                className={`${isActive ? "active" : ""}${isRelated ? " related" : ""}`}
                                type="button"
                                aria-pressed={isActive}
                                aria-label={`${series.title}, ${item.number}. ${item.title}. ${item.verse}. Franja ${item.bands?.join(" y ")}`}
                                onClick={() => onSelect(item.id)}
                              >
                                <span><b>{item.number}</b><i>Ver conexión</i></span>
                                <strong>{item.title}</strong>
                                <small>{item.phaseLabel}</small>
                              </button>
                              <BiblePassage reference={item.verse} className="panorama-bible-passage">{item.verse.replace("Apocalipsis ", "Ap ")} · Leer</BiblePassage>
                            </li>
                          );
                        })}
                      </ol>
                    </section>
                  ))}
                </div>
              </div>
            </div>

            <div className="panorama-legend" aria-label="Leyenda del mapa">
              <span><i className="selected" /> Selección</span>
              <span><i className="related" /> Franja relacionada</span>
              <span className="panorama-mobile-hint">Desliza horizontalmente para comparar →</span>
              <p>La aplicación histórica de las trompetas se marca como debatida cuando no existe consenso.</p>
            </div>
          </div>
        ) : (
          <div className="revelation-climax-view" role="tabpanel">
            <div className="climax-guide">
              <div>
                <span>EL CONFLICTO SE ACERCA</span>
                <strong>Dos llamados. Una decisión.</strong>
              </div>
              <p>Apocalipsis 14 responde punto por punto al sistema de adoración y coerción presentado en el capítulo 13.</p>
            </div>

            <div className="climax-board" role="list" aria-label="Contrastes entre Apocalipsis 13 y 14">
              <div className="climax-head" aria-hidden="true">
                <span>APOCALIPSIS 13 <small>Presión y falsificación</small></span>
                <i>↔</i>
                <span>APOCALIPSIS 14 <small>Evangelio y fidelidad</small></span>
              </div>
              {revelationClimax.map((item) => (
                <div role="listitem" key={item.id}>
                  <button
                    className={`climax-contrast${item.id === "climax-harvest" ? " climax-harvest" : ""}${activeId === item.id ? " active" : ""}`}
                    type="button"
                    aria-pressed={activeId === item.id}
                    onClick={() => onSelect(item.id)}
                  >
                    <span className="climax-side threat">
                      <small>{item.threatVerse}</small>
                      <strong>{item.threat}</strong>
                    </span>
                    <span className="climax-arrow" aria-hidden="true"><i>{item.number}</i><b>→</b></span>
                    <span className="climax-side response">
                      <small>{item.responseVerse}</small>
                      <strong>{item.response}</strong>
                    </span>
                  </button>
                </div>
              ))}
            </div>

            <div className="climax-footer">
              <span>EVANGELIO ETERNO</span>
              <i aria-hidden="true" />
              <span>DECISIÓN</span>
              <i aria-hidden="true" />
              <span>COSECHA</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
