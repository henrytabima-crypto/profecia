from pathlib import Path
from xml.etree import ElementTree as ET
import json


def parse(source):
    bible = {}
    for book in ET.parse(source).getroot().findall('book'):
        chapters = {}
        chapter, verse, parts = None, None, []
        def flush():
            nonlocal verse, parts
            if verse is not None:
                text = ' '.join(''.join(parts).split())
                # Some RV1909 source positions are empty; preserve for validation.
                assert verse not in chapters[chapter], (book.get('id'), chapter, verse)
                chapters[chapter][verse] = text
            verse, parts = None, []
        def walk(element):
            nonlocal chapter, verse, parts
            if element.tag == 'c':
                flush()
                chapter = element.get('id')
                chapters[chapter] = {}
            elif element.tag == 'v':
                flush()
                verse = element.get('id')
                assert chapter is not None
            elif element.tag == 've':
                flush()
            elif element.tag in {'id', 'h', 'toc', 'f', 'x', 's', 'r'} or (element.tag == 'p' and element.get('sfm') == 'mt'):
                return
            else:
                if verse is not None and element.text:
                    parts.append(element.text)
                for child in element:
                    walk(child)
                    if verse is not None and child.tail:
                        parts.append(child.tail)
        walk(book)
        flush()
        bible[book.get('id')] = chapters
    return bible

if __name__ == '__main__':
    import argparse, hashlib
    cli = argparse.ArgumentParser(description="Build the local RV1909 chapters from the official eBible USFX XML.")
    cli.add_argument("source", type=Path)
    cli.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1] / "public/bible/rv1909")
    args = cli.parse_args()
    catalog = json.loads((args.output / "catalog.json").read_text())
    digest = hashlib.sha256(args.source.read_bytes()).hexdigest()
    if digest != catalog["sourceXmlSha256"]:
        raise ValueError("The source differs from the verified XML recorded in catalog.json.")
    bible = parse(args.source)
    count = 0
    for book, chapters in catalog["chapters"].items():
        result = {}
        for chapter in chapters:
            original = bible[book][str(chapter)]
            numbers = sorted(map(int, original))
            if numbers != list(range(1, numbers[-1] + 1)):
                raise ValueError(f"Nonconsecutive verse numbering: {book} {chapter}")
            values = [original[str(number)] for number in numbers]
            if not all(values):
                raise ValueError(f"Empty verse in requested chapter: {book} {chapter}")
            result[str(chapter)] = values
            count += len(values)
        (args.output / f"{book}.json").write_text(json.dumps({"book":book,"chapters":result},ensure_ascii=False,separators=(",", ":"))+"\n",encoding="utf-8")
    print(f"Generated {len(catalog['chapters'])} books, {count} verses.")
