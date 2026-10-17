"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { bibleEdition, parsePassage, sectionTitle, selectVerses, type BibleBook, type PassageSection } from "../data/bible";
import useQuickTransition from "../hooks/useQuickTransition";

const ReaderContext = createContext<{ openPassage: (reference: string) => void; isOpen: boolean } | null>(null);
export function useBibleReader() {
  const context = useContext(ReaderContext);
  if (!context) throw new Error("BibleReaderProvider is required.");
  return context;
}

export function BiblePassage({ reference, children, className = "" }: { reference: string; children?: ReactNode; className?: string }) {
  const { openPassage } = useBibleReader();
  return <button type="button" className={`bible-passage ${className}`} onClick={() => openPassage(reference)} aria-haspopup="dialog" aria-label={`Leer ${reference} aquí`}>{children ?? <>{reference}<span aria-hidden="true">Leer</span></>}</button>;
}

export function BibleReaderProvider({ children }: { children: ReactNode }) {
  const [reference, setReference] = useState<string | null>(null);
  const openPassage = useCallback((value: string) => setReference(value), []);
  const close = useCallback(() => setReference(null), []);
  return <ReaderContext.Provider value={{ openPassage, isOpen: reference !== null }}>{children}{reference !== null && createPortal(<BibleReaderDialog key={reference} reference={reference} onClose={close} />, document.body)}</ReaderContext.Provider>;
}

const bookCache = new Map<string, BibleBook>();
function parseReference(reference: string): { sections: PassageSection[]; error: string } {
  try { return { sections: parsePassage(reference), error: "" }; }
  catch { return { sections: [], error: "No pudimos reconocer esta referencia. Puedes cerrar el lector y seguir donde estabas." }; }
}

type Reading = { book: string; data?: BibleBook; error?: string };
function BibleReaderDialog({ reference, onClose }: { reference: string; onClose: () => void }) {
  const [{ sections, error: referenceError }] = useState(() => parseReference(reference));
  const [position, setPosition] = useState(0);
  const [fullChapter, setFullChapter] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [reading, setReading] = useState<Reading>({ book: "" });
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const body = useQuickTransition<HTMLDivElement>(`${position}:${fullChapter}`, { onMount: false, distance: 4, duration: 140 });
  const backdropPointer = useRef(false);
  const section = sections[position];
  const bookCode = section?.book;

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    title.current?.focus();
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      queueMicrotask(() => { if (trigger?.isConnected) trigger.focus({ preventScroll: true }); });
    };
  }, []);

  useEffect(() => {
    if (!bookCode) return;
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    async function load() {
      try {
        let book = bookCache.get(bookCode!);
        if (!book) {
          const response = await fetch(`/bible/${bibleEdition.id}/${bookCode}.json`, { signal: controller.signal });
          if (!response.ok) throw new Error("Book unavailable");
          book = await response.json() as BibleBook;
          if (book.book !== bookCode || !book.chapters || typeof book.chapters !== "object") throw new Error("Invalid book");
          if (active) bookCache.set(bookCode!, book);
        }
        if (active) setReading({ book: bookCode!, data: book });
      } catch {
        if (active) setReading({ book: bookCode!, error: "No pudimos cargar el pasaje. Intenta de nuevo; tu avance sigue guardado." });
      } finally { window.clearTimeout(timeout); }
    }
    void load();
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, [bookCode, attempt]);

  let verses: ReturnType<typeof selectVerses> = [];
  let error = referenceError || (reading.book === bookCode ? reading.error : "");
  const loadedBook = reading.book === bookCode ? reading.data : undefined;
  if (section && loadedBook) {
    try { verses = selectVerses(section, loadedBook, fullChapter); }
    catch { error = "Este pasaje no está disponible completo. Puedes volver a intentarlo o regresar al estudio."; }
  }

  function changeSection(index: number) {
    setPosition(index);
    setFullChapter(false);
    body.current?.scrollTo({ top: 0 });
    window.requestAnimationFrame(() => title.current?.focus({ preventScroll: true }));
  }
  function retry() {
    if (!bookCode) return;
    bookCache.delete(bookCode);
    setReading({ book: "" });
    setAttempt((value) => value + 1);
  }

  return <dialog ref={dialog} className="bible-reader" aria-labelledby="bible-reader-title" aria-describedby="bible-reader-edition" onCancel={(event) => { event.preventDefault(); onClose(); }} onPointerDown={(event) => { backdropPointer.current = event.target === event.currentTarget; }} onPointerUp={(event) => { if (backdropPointer.current && event.target === event.currentTarget) onClose(); backdropPointer.current = false; }}>
    <div className="bible-reader-panel">
      <header className="bible-reader-header"><div><p>LECTURA BÍBLICA</p><h2 id="bible-reader-title" ref={title} tabIndex={-1}>{section ? sectionTitle(section) : reference}</h2><span id="bible-reader-edition">{bibleEdition.name}</span></div><button type="button" className="bible-reader-close" onClick={onClose} aria-label="Cerrar lectura bíblica">×</button></header>
      {sections.length > 1 && <div className="bible-reader-sections"><label htmlFor="bible-passage-section">Pasajes de esta lectura</label><select id="bible-passage-section" value={position} onChange={(event) => changeSection(Number(event.target.value))}>{sections.map((item, index) => <option key={`${item.book}-${item.chapter}`} value={index}>{sectionTitle(item)}</option>)}</select><span>{position + 1} de {sections.length}</span></div>}
      {section?.ranges && !error && <div className="bible-reader-context"><span>{fullChapter ? "Capítulo completo · Pasaje resaltado" : "Versículos citados"}</span><button type="button" onClick={() => { setFullChapter((value) => !value); body.current?.scrollTo({ top: 0 }); }}>{fullChapter ? "Ver solo el pasaje" : "Leer capítulo completo"}</button></div>}
      <div className="bible-reader-body" ref={body}>
        {error ? <div className="bible-reader-status" role="alert"><p>{error}</p>{!referenceError && <button type="button" onClick={retry}>Volver a intentar</button>}</div> : !loadedBook ? <p className="bible-reader-status" role="status">Abriendo el pasaje…</p> : <div className="bible-verses" aria-label={fullChapter ? `${section.bookName} ${section.chapter}, capítulo completo` : sectionTitle(section)}>{verses.map((verse, index) => <div key={verse.number}>{index > 0 && verse.number !== verses[index - 1].number + 1 && <p className="bible-verse-gap" aria-label="Continúa en otro versículo">· · ·</p>}<p className={fullChapter && section.ranges && verse.selected ? "bible-verse highlighted" : "bible-verse"}><span className="bible-verse-number" aria-label={`Versículo ${verse.number}`}>{verse.number}</span><span>{verse.text}</span></p></div>)}</div>}
      </div>
      <footer className="bible-reader-footer">{sections.length > 1 && <nav aria-label="Navegar por los pasajes citados"><button type="button" onClick={() => changeSection(position - 1)} disabled={position === 0}>← Anterior</button><button type="button" onClick={() => changeSection(position + 1)} disabled={position === sections.length - 1}>Siguiente →</button></nav>}<div><span>Texto de dominio público · RV1909</span><button type="button" className="bible-return" onClick={onClose}>Volver al estudio <span aria-hidden="true">↵</span></button></div></footer>
    </div>
  </dialog>;
}
