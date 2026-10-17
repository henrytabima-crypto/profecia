"use client";

import { BiblePassage, useBibleReader } from "./BibleReader";
import { useCallback, useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import {
  glossaryEntries,
  glossarySources,
  glossaryTopics,
  type GlossaryEvidence,
  type GlossaryEntry,
  type GlossaryTopic,
} from "../data/glossary";

const evidenceLabels: Record<GlossaryEvidence, string> = {
  text: "Definición del texto",
  association: "Asociación bíblica",
  adventist: "Lectura adventista",
};

const normalize = (value: string) => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase("es");

export default function PropheticGlossary() {
  const { isOpen: bibleReaderOpen } = useBibleReader();
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<"Todos" | GlossaryTopic>("Todos");
  const [selectedEntry, setSelectedEntry] = useState<GlossaryEntry | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement>(null);

  const filteredEntries = useMemo(() => {
    const tokens = normalize(query).split(/\s+/).filter(Boolean);

    return glossaryEntries
      .filter((entry) => topic === "Todos" || entry.topics.includes(topic))
      .filter((entry) => {
        if (!tokens.length) return true;
        const searchable = normalize([
          entry.term,
          ...entry.aliases,
          entry.kind,
          ...entry.topics,
          entry.summary,
          ...entry.claims.flatMap((claim) => [claim.meaning, ...claim.references]),
          entry.caution ?? "",
        ].join(" "));
        return tokens.every((token) => searchable.includes(token));
      })
      .sort((a, b) => a.term.localeCompare(b.term, "es"));
  }, [query, topic]);

  const clearFilters = () => {
    setQuery("");
    setTopic("Todos");
  };

  const openEntry = (entry: GlossaryEntry, event: MouseEvent<HTMLButtonElement>) => {
    lastTriggerRef.current = event.currentTarget;
    setSelectedEntry(entry);
  };

  const closeEntry = useCallback(() => {
    setSelectedEntry(null);
    window.requestAnimationFrame(() => lastTriggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!selectedEntry || bibleReaderOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeEntry();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;

      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )).filter((element) => !element.hasAttribute("hidden"));

      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeEntry, selectedEntry, bibleReaderOpen]);

  return (
    <section className="glossary-section" id="glosario">
      <div className="glossary-heading">
        <div>
          <p className="overline"><span /> Diccionario de símbolos</p>
          <h2>El texto primero.<br /><em>El símbolo después.</em></h2>
        </div>
        <div className="glossary-intro">
          <p>Un símbolo no funciona como una contraseña universal. Primero buscamos la explicación en el propio pasaje; después, en el mismo libro y en el resto de la Biblia.</p>
          <a href={glossarySources.method.url} target="_blank" rel="noreferrer">
            Ver el método de interpretación <span>↗</span>
          </a>
        </div>
      </div>

      <div className="glossary-legend" aria-label="Niveles de evidencia del glosario">
        {(Object.entries(evidenceLabels) as Array<[GlossaryEvidence, string]>).map(([level, label]) => (
          <div key={level}><i className={`evidence-dot ${level}`} aria-hidden="true" /><span>{label}</span></div>
        ))}
      </div>

      <form className="glossary-controls" role="search" onSubmit={(event) => event.preventDefault()}>
        <div className="glossary-search">
          <label htmlFor="glossary-query">Buscar símbolo, significado o pasaje</label>
          <div>
            <input
              id="glossary-query"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ej. cuerno, sello, Daniel 8…"
              autoComplete="off"
            />
            {(query || topic !== "Todos") && <button type="button" onClick={clearFilters}>Limpiar</button>}
          </div>
        </div>

        <fieldset>
          <legend>Filtrar por tema</legend>
          <div>
            {glossaryTopics.map((item) => (
              <button
                key={item}
                type="button"
                className={topic === item ? "active" : ""}
                aria-pressed={topic === item}
                onClick={() => setTopic(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>
      </form>

      <div className="glossary-results-bar">
        <p aria-live="polite"><strong>{String(filteredEntries.length).padStart(2, "0")}</strong> {filteredEntries.length === 1 ? "término encontrado" : "términos encontrados"}</p>
        <span>Abre una ficha para ver el razonamiento y sus textos</span>
      </div>

      {filteredEntries.length ? (
        <ul className="glossary-grid">
          {filteredEntries.map((entry, index) => (
            <li key={entry.id}>
              <button
                type="button"
                className="glossary-entry"
                id={`simbolo-${entry.id}`}
                aria-haspopup="dialog"
                onClick={(event) => openEntry(entry, event)}
              >
                <span className="glossary-entry-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="glossary-entry-title">
                  <small>{entry.kind} · {entry.topics.join(" / ")}</small>
                  <h3>{entry.term}</h3>
                  <span>{entry.summary}</span>
                </span>
                <span className="glossary-entry-toggle" aria-hidden="true">+</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="glossary-empty" role="status">
          <span>Sin coincidencias</span>
          <p>Prueba otra palabra o vuelve a mostrar todos los temas.</p>
          <button type="button" onClick={clearFilters}>Restablecer glosario</button>
        </div>
      )}

      {selectedEntry && (
        <div
          className="glossary-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEntry();
          }}
        >
          <article
            className="glossary-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`glossary-modal-title-${selectedEntry.id}`}
            aria-describedby={`glossary-modal-summary-${selectedEntry.id}`}
            ref={modalRef}
          >
            <header className="glossary-modal-header">
              <div>
                <span>Ficha profética</span>
                <small>{selectedEntry.kind} · {selectedEntry.topics.join(" / ")}</small>
              </div>
              <button
                type="button"
                aria-label={`Cerrar ficha de ${selectedEntry.term}`}
                onClick={closeEntry}
                ref={closeButtonRef}
              >
                ×
              </button>
            </header>

            <div className="glossary-modal-body">
              <div className="glossary-modal-summary">
                <p>Significado en contexto</p>
                <h2 id={`glossary-modal-title-${selectedEntry.id}`}>{selectedEntry.term}</h2>
                <p id={`glossary-modal-summary-${selectedEntry.id}`}>{selectedEntry.summary}</p>

                {selectedEntry.caution && (
                  <p className="glossary-caution"><strong>Leer con cuidado</strong>{selectedEntry.caution}</p>
                )}
              </div>

              <div className="glossary-modal-content">
                <div className="glossary-modal-kicker">
                  <span>Cómo llegamos a esta lectura</span>
                  <small>Textos y nivel de evidencia</small>
                </div>

                <div className="glossary-claims">
                  {selectedEntry.claims.map((claim, claimIndex) => (
                    <article className={`glossary-claim ${claim.evidence}`} key={`${selectedEntry.id}-${claimIndex}`}>
                      <div><i className={`evidence-dot ${claim.evidence}`} aria-hidden="true" /><span>{evidenceLabels[claim.evidence]}</span></div>
                      <p>{claim.meaning}</p>
                      <div className="glossary-verses" aria-label="Referencias bíblicas">
                        {claim.references.map((reference) => (
                          <BiblePassage reference={reference} key={reference} />
                        ))}
                      </div>
                    </article>
                  ))}
                </div>

                {selectedEntry.sourceIds?.length ? (
                  <div className="glossary-sources">
                    <p>Para profundizar</p>
                    {selectedEntry.sourceIds.map((sourceId) => {
                      const source = glossarySources[sourceId as keyof typeof glossarySources];
                      return (
                        <a href={source.url} target="_blank" rel="noreferrer" key={sourceId}>
                          <span><small>{source.kind}</small>{source.label}</span><b>↗</b>
                        </a>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
