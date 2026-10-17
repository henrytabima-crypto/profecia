import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { parsePassage, selectVerses, sectionTitle } from "../app/data/bible.ts";
import { levelDefinitions } from "../app/data/levels.ts";
import { modules } from "../app/data/studies.ts";
import { glossaryEntries } from "../app/data/glossary.ts";
import { revelationItems, revelationSeries } from "../app/data/revelation.ts";
import { sanctuaryOverview, sanctuaryStations } from "../app/data/sanctuary.ts";

import { JOURNEY_STEPS } from "../app/data/danielJourney.ts";
import { finalReadings, missionGuides } from "../app/data/missionGuides.ts";

const bookCache = new Map();
async function bookData(book) {
  if (!bookCache.has(book)) bookCache.set(book, JSON.parse(await readFile(new URL(`../public/bible/rv1909/${book}.json`, import.meta.url), "utf8")));
  return bookCache.get(book);
}

test("all Bible references in the game resolve to complete local text", async () => {
  const viewer = await readFile(new URL("../app/components/ResourceViewer.tsx", import.meta.url), "utf8");
  const references = [
    ...levelDefinitions.flatMap((definition) => [...definition.readings, ...(definition.explorationReadings ?? [])].map((reading) => reading.reference)),
    ...finalReadings.map((reading) => reading.reference),
    ...missionGuides.flatMap((guide) => [...guide.discover.rounds, ...guide.connect.rounds].map((round) => round.reference)),
    ...JOURNEY_STEPS.map((step) => step.reference),
    ...modules.flatMap((lesson) => [...lesson.verses, ...lesson.sources.filter((source) => source.kind === "Biblia").map((source) => source.label.split(" ·")[0])]),
    ...glossaryEntries.flatMap((entry) => entry.claims.flatMap((claim) => claim.references)),
    ...revelationItems.map((item) => item.verse), ...revelationSeries.map((series) => series.verse),
    sanctuaryOverview.verse, ...sanctuaryStations.map((station) => station.verse),
    ...[...viewer.matchAll(/verse: "([^"]+)"/g)].map((match) => match[1]),
    ...[...viewer.matchAll(/\["Texto bíblico", "([^"]+)"/g)].map((match) => match[1]),
  ];
  for (const reference of new Set(references)) {
    const sections = parsePassage(reference);
    assert.ok(sections.length > 0, reference);
    for (const section of sections) {
      const data = await bookData(section.book);
      const verses = selectVerses(section, data);
      assert.ok(verses.length > 0, reference);
      assert.ok(verses.every((verse) => verse.text.trim().length > 0), reference);
      assert.ok(selectVerses(section, data, true).length >= verses.length, `full context for ${reference}`);
    }
  }
});

test("final questions have short, relevant readings and label historical context separately", async () => {
  assert.equal(finalReadings.length, modules.length);
  for (const reading of finalReadings) {
    let count = 0;
    for (const section of parsePassage(reading.reference)) {
      assert.notEqual(section.ranges, null, "final readings should cite verses rather than entire chapters");
      count += selectVerses(section, await bookData(section.book)).length;
    }
    assert.ok(count > 0 && count <= 6, reading.reference);
  }
  assert.equal(finalReadings[2].preparationLabel, "Contexto histórico adventista");
  assert.match(finalReadings[2].preparation, /Después del Gran Chasco/);
  assert.equal(finalReadings[4].reference, "Apocalipsis 14:6–7");
  assert.equal(finalReadings[6].reference, "1 Tesalonicenses 4:16–18");
});

test("selects the exact requested verses and distinguishes context from cited text", async () => {
  const [section] = parsePassage("Apocalipsis 12:7–12");
  const data = await bookData("REV");
  const verses = selectVerses(section, data);
  assert.deepEqual(verses.map((verse) => verse.number), [7, 8, 9, 10, 11, 12]);
  assert.match(verses[0].text, /Miguel/);
  const chapter = selectVerses(section, data, true);
  assert.equal(chapter.length, 17);
  assert.deepEqual(chapter.filter((verse) => verse.selected).map((verse) => verse.number), [7, 8, 9, 10, 11, 12]);
});

test("commas denote disjoint verses and semicolons inherit the book", async () => {
  const [daniel] = parsePassage("Daniel 7:8, 20–25");
  assert.deepEqual(selectVerses(daniel, await bookData("DAN")).map((verse) => verse.number), [8, 20, 21, 22, 23, 24, 25]);
  const parts = parsePassage("Éxodo 30:17–21; 38:8");
  assert.deepEqual(parts.map((part) => [part.book, part.chapter]), [["EXO", 30], ["EXO", 38]]);
  assert.equal(selectVerses(parts[1], await bookData("EXO"))[0].number, 8);
  const mixed = parsePassage("Éxodo 25–30 · Hebreos 7–10");
  assert.equal(mixed.length, 10);
  assert.equal(mixed[6].book, "HEB");
});

test("supports whole chapters, numbered books and ranges ending inside a chapter", async () => {
  assert.deepEqual(parsePassage("Daniel 2 y 7").map((part) => part.chapter), [2, 7]);
  assert.deepEqual(parsePassage("Hebreos 7–10").map((part) => part.chapter), [7, 8, 9, 10]);
  const parts = parsePassage("Apocalipsis 6–8:1");
  assert.deepEqual(parts.map((part) => part.chapter), [6, 7, 8]);
  assert.equal(parts[0].ranges, null);
  assert.deepEqual(selectVerses(parts[2], await bookData("REV")).map((verse) => verse.number), [1]);
  assert.equal(parsePassage("2 Pedro 1:19–21")[0].book, "2PE");
  assert.equal(parsePassage("1 Tesalonicenses 4:13–18")[0].book, "1TH");
  assert.equal(parsePassage("Salmo 119:105")[0].book, "PSA");
  assert.equal(sectionTitle(parsePassage("Daniel 7:17, 23")[0]), "Daniel 7:17, 23");
});

test("rejects malformed, inverted and nonexistent passages without returning unrelated text", async () => {
  for (const reference of ["", "Un libro 2:3", "Daniel 0", "Daniel 8–2", "Daniel 7:25–20", "Daniel 9999", "Daniel 7; Unknown 4", "Daniel 7:1, nope"]) assert.throws(() => parsePassage(reference), reference);
  const daniel = await bookData("DAN");
  assert.throws(() => selectVerses(parsePassage("Daniel 7:99")[0], daniel));
  assert.throws(() => selectVerses(parsePassage("Daniel 150")[0], daniel));
  assert.throws(() => selectVerses(parsePassage("Juan 14:1")[0], daniel));
  assert.throws(() => selectVerses(parsePassage("Daniel 7:1")[0], { book: "DAN", chapters: { "7": [""] } }));
});

test("ships identified public-domain chapters without HTML or external runtime dependencies", async () => {
  const catalog = JSON.parse(await readFile(new URL("../public/bible/rv1909/catalog.json", import.meta.url), "utf8"));
  assert.equal(catalog.edition, "Reina-Valera 1909");
  assert.equal(catalog.license, "Public domain");
  for (const [book, chapters] of Object.entries(catalog.chapters)) {
    const data = await bookData(book);
    assert.deepEqual(Object.keys(data.chapters).map(Number), chapters);
    for (const verses of Object.values(data.chapters)) {
      assert.ok(verses.every((verse) => typeof verse === "string" && verse.length > 0 && !/<[^>]+>/.test(verse)));
    }
  }
});
