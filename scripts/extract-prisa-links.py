#!/usr/bin/env python3
"""Extract every external URI annotation from the four verified prisa PDFs.

The output is deterministic and dependency-free. Duplicate annotations are kept
as occurrence counts, while every distinct URI remains available to the HTML
reader. The source PDFs remain immutable.
"""
from __future__ import annotations

from collections import Counter
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/data/prisa-links.generated.ts"
TARGETS = [
    ("prisa-7", "פריסת הוראה — כיתה ז׳", "public/docs/prisa-7-tashpaz.pdf"),
    ("prisa-8", "פריסת הוראה — כיתה ח׳", "public/docs/prisa-8-tashpaz.pdf"),
    ("prisa-9a", "פריסת הוראה — כיתה ט׳", "public/docs/prisa-9a-tashpaz.pdf"),
    ("prisa-9b", "פריסת הוראה — כיתה ט׳ — מסלול מצומצם", "public/docs/prisa-9b-tashpaz.pdf"),
]
URI = re.compile(rb"/URI\s*(?:\(((?:\\.|[^\\)])*)\)|<([0-9A-Fa-f]+)>)")


def unescape_literal(value: bytes) -> bytes:
    out = bytearray()
    index = 0
    escapes = {ord("n"): 10, ord("r"): 13, ord("t"): 9, ord("b"): 8, ord("f"): 12}
    while index < len(value):
        current = value[index]
        if current != 92 or index + 1 >= len(value):
            out.append(current)
            index += 1
            continue
        index += 1
        current = value[index]
        if current in escapes:
            out.append(escapes[current])
            index += 1
        elif current in (ord("("), ord(")"), 92):
            out.append(current)
            index += 1
        elif 48 <= current <= 55:
            end = index + 1
            while end < min(index + 3, len(value)) and 48 <= value[end] <= 55:
                end += 1
            out.append(int(value[index:end], 8))
            index = end
        elif current in (10, 13):
            if current == 13 and index + 1 < len(value) and value[index + 1] == 10:
                index += 1
            index += 1
        else:
            out.append(current)
            index += 1
    return bytes(out)


def extract(pdf: Path) -> list[str]:
    raw = pdf.read_bytes()
    links: list[str] = []
    for literal, hexadecimal in URI.findall(raw):
        value = unescape_literal(literal) if literal else bytes.fromhex(hexadecimal.decode("ascii"))
        href = value.decode("utf-8", errors="strict")
        if href.startswith(("https://", "http://")):
            links.append(href)
    return links


def main() -> None:
    documents: dict[str, object] = {}
    all_unique: set[str] = set()
    total = 0
    for key, label, rel in TARGETS:
        pdf = ROOT / rel
        if not pdf.is_file():
            raise SystemExit(f"missing source PDF: {rel}")
        occurrences = extract(pdf)
        if not occurrences:
            raise SystemExit(f"no URI annotations found: {rel}")
        counts = Counter(occurrences)
        links = [{"href": href, "occurrences": count} for href, count in counts.items()]
        documents[key] = {
            "id": key,
            "label": label,
            "pdf": "/" + rel.removeprefix("public/"),
            "occurrenceCount": len(occurrences),
            "uniqueCount": len(links),
            "links": links,
        }
        total += len(occurrences)
        all_unique.update(counts)

    payload = {
        "schema": 1,
        "generator": "scripts/extract-prisa-links.py",
        "totalOccurrences": total,
        "uniqueAcrossDocuments": len(all_unique),
        "documents": documents,
    }
    body = "// GENERATED FILE — do not hand-edit.\n"
    body += "// Source: URI link annotations in the four verified Tashpaz prisa PDFs.\n"
    body += "export const prisaLinksContent = "
    body += json.dumps(payload, ensure_ascii=False, indent=2)
    body += " as const;\n\n"
    body += "export type PrisaLinksDocumentKey = keyof typeof prisaLinksContent.documents;\n"
    OUT.write_text(body, encoding="utf-8")
    print(f"generated {OUT.relative_to(ROOT)}: {total} occurrences, {len(all_unique)} unique URIs")


if __name__ == "__main__":
    main()
