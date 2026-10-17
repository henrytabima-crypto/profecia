export const bibleEdition = {
  id: "rv1909",
  name: "Reina-Valera 1909",
  source: "https://ebible.org/spaRV1909/copyright.htm",
};

const bookNames: Record<string, string> = {
  GEN: "Génesis", EXO: "Éxodo", LEV: "Levítico", NUM: "Números", DEU: "Deuteronomio",
  PSA: "Salmos", ECC: "Eclesiastés", ISA: "Isaías", JER: "Jeremías", EZK: "Ezequiel",
  DAN: "Daniel", JOL: "Joel", AMO: "Amós", ZEC: "Zacarías", MAT: "Mateo", JHN: "Juan",
  "1CO": "1 Corintios", "2CO": "2 Corintios", EPH: "Efesios", "1TH": "1 Tesalonicenses",
  HEB: "Hebreos", "1PE": "1 Pedro", "2PE": "2 Pedro", REV: "Apocalipsis",
};
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const bookCodes = Object.fromEntries(Object.entries(bookNames).map(([code, name]) => [normalize(name), code]));
bookCodes.salmo = "PSA";

export type VerseRange = { start: number; end: number };
export type PassageSection = { book: string; bookName: string; chapter: number; ranges: VerseRange[] | null };
export type BibleBook = { book: string; chapters: Record<string, string[]> };

function positive(value: string, max: number): number {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 1 || number > max) throw new Error("La referencia contiene un número fuera de rango.");
  return number;
}

/** Parse the catalog's Spanish references without approximating disjoint verses. */
export function parsePassage(reference: string): PassageSection[] {
  const sections: PassageSection[] = [];
  let book: string | undefined;
  const clean = reference.trim().replace(/[–—]/g, "-").replace(/\s*·\s*/g, "; ");
  if (!clean || clean.length > 500) throw new Error("No se pudo reconocer el pasaje.");

  function add(chapter: number, ranges: VerseRange[] | null) {
    const existing = sections.find((section) => section.book === book && section.chapter === chapter);
    if (existing) existing.ranges = existing.ranges && ranges ? [...existing.ranges, ...ranges] : null;
    else sections.push({ book: book!, bookName: bookNames[book!], chapter, ranges });
  }

  for (const fragment of clean.split(/\s*;\s*|\s+y\s+/)) {
    let expression = fragment.trim();
    const named = expression.match(/^(.+?)\s+(\d[\d\s:,-]*)$/);
    if (named) {
      book = bookCodes[normalize(named[1])];
      expression = named[2];
    }
    if (!book || !expression) throw new Error("No se pudo reconocer el libro del pasaje.");
    let verseChapter: number | null = null;
    for (const raw of expression.split(",")) {
      const part = raw.trim();
      const withVerse = part.match(/^(\d+):(\d+)(?:-(?:(\d+):)?(\d+))?$/);
      const chapterToVerse = part.match(/^(\d+)-(\d+):(\d+)$/);
      if (withVerse) {
        const chapter = positive(withVerse[1], 150);
        const start = positive(withVerse[2], 200);
        const endChapter = withVerse[3] ? positive(withVerse[3], 150) : chapter;
        const end = withVerse[4] ? positive(withVerse[4], 200) : start;
        if (endChapter < chapter || (endChapter === chapter && end < start)) throw new Error("El rango del pasaje está invertido.");
        for (let current = chapter; current <= endChapter; current++) {
          add(current, current > chapter && current < endChapter ? null : [{ start: current === chapter ? start : 1, end: current === endChapter ? end : Infinity }]);
        }
        verseChapter = endChapter;
      } else if (chapterToVerse) {
        const start = positive(chapterToVerse[1], 150), endChapter = positive(chapterToVerse[2], 150), endVerse = positive(chapterToVerse[3], 200);
        if (endChapter < start) throw new Error("El rango del pasaje está invertido.");
        for (let chapter = start; chapter <= endChapter; chapter++) add(chapter, chapter === endChapter ? [{ start: 1, end: endVerse }] : null);
        verseChapter = endChapter;
      } else {
        const range = part.match(/^(\d+)(?:-(\d+))?$/);
        if (!range) throw new Error("No se pudo reconocer el rango del pasaje.");
        const start = positive(range[1], verseChapter === null ? 150 : 200), end = range[2] ? positive(range[2], verseChapter === null ? 150 : 200) : start;
        if (end < start) throw new Error("El rango del pasaje está invertido.");
        if (verseChapter !== null) add(verseChapter, [{ start, end }]);
        else for (let chapter = start; chapter <= end; chapter++) add(chapter, null);
      }
    }
  }
  if (!sections.length || sections.length > 200) throw new Error("No se pudo reconocer el pasaje.");
  return sections;
}

export function sectionTitle(section: PassageSection): string {
  const suffix = section.ranges ? `:${section.ranges.map(({ start, end }) => start === end ? start : `${start}–${end === Infinity ? "fin" : end}`).join(", ")}` : "";
  return `${section.bookName} ${section.chapter}${suffix}`;
}

export function selectVerses(section: PassageSection, book: BibleBook, fullChapter = false) {
  const chapter = book.chapters[String(section.chapter)];
  if (book.book !== section.book || !Array.isArray(chapter) || !chapter.length || chapter.some((verse) => typeof verse !== "string" || !verse.trim())) throw new Error("No encontramos el texto completo de este capítulo.");
  if (section.ranges?.some(({ start, end }) => start > chapter.length || (end !== Infinity && end > chapter.length))) throw new Error("La referencia no coincide con los versículos de este capítulo.");
  return chapter.map((text, index) => ({ number: index + 1, text, selected: section.ranges?.some(({ start, end }) => index + 1 >= start && index + 1 <= end) ?? true }))
    .filter((verse) => fullChapter || verse.selected);
}
