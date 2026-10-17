"use client";

import { useEffect, useState } from "react";
import { bibleEdition, parsePassage, sectionTitle, selectVerses, type BibleBook } from "../data/bible";
import { BiblePassage } from "./BibleReader";

const bookCache = new Map<string, BibleBook>();
type Excerpt = { title: string; verses: ReturnType<typeof selectVerses> };
type Reading = { key: string; passages?: Excerpt[]; error?: boolean };

/** Present the cited text in place, before the learner needs it to answer. */
export default function BibleExcerpt({ reference, label = "Texto bíblico" }: { reference: string; label?: string }) {
  const [attempt, setAttempt] = useState(0);
  const [reading, setReading] = useState<Reading | null>(null);
  const key = `${reference}:${attempt}`;
  const current = reading?.key === key ? reading : null;

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 10000);
    async function load() {
      try {
        const sections = parsePassage(reference);
        const books = new Map(await Promise.all([...new Set(sections.map((section) => section.book))].map(async (code) => {
          let book = bookCache.get(code);
          if (!book) {
            const response = await fetch(`/bible/${bibleEdition.id}/${code}.json`, { signal: controller.signal });
            if (!response.ok) throw new Error("Passage unavailable");
            book = await response.json() as BibleBook;
            if (book.book !== code || !book.chapters || typeof book.chapters !== "object") throw new Error("Invalid book");
            if (active) bookCache.set(code, book);
          }
          return [code, book] as const;
        })));
        const passages = sections.map((section) => ({ title: sectionTitle(section), verses: selectVerses(section, books.get(section.book)!) }));
        if (active) setReading({ key, passages });
      } catch {
        if (active) setReading({ key, error: true });
      } finally { window.clearTimeout(timeout); }
    }
    void load();
    return () => { active = false; window.clearTimeout(timeout); controller.abort(); };
  }, [reference, key]);

  return <div className="bible-excerpt" aria-label={`Texto bíblico: ${reference}`}>
    <div className="bible-excerpt-label"><span>{label}</span><span>{bibleEdition.name}</span></div>
    {current?.error ? <div role="status"><p>No pudimos cargar los versículos. La clave de lectura sigue disponible debajo.</p><button type="button" onClick={() => setAttempt((value) => value + 1)}>Volver a cargar el texto</button></div>
      : !current?.passages ? <p role="status">Preparando el texto para leer aquí…</p>
        : current.passages.map((passage) => <div key={passage.title} className="bible-excerpt-passage"><p className="bible-excerpt-title">{passage.title}</p><blockquote>{passage.verses.map((verse, index) => <div key={verse.number}>{index > 0 && verse.number !== passage.verses[index - 1].number + 1 && <p className="bible-excerpt-gap" aria-label="Continúa en otro versículo">· · ·</p>}<p><sup aria-label={`Versículo ${verse.number}`}>{verse.number}</sup> {verse.text}</p></div>)}</blockquote></div>)}
    <BiblePassage reference={reference} className="bible-excerpt-context">Leer en su contexto <span aria-hidden="true">↗</span></BiblePassage>
  </div>;
}
