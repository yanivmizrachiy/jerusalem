#!/usr/bin/env python3
"""Build the static HTML-reader content for the official Tashpaz plan/prisa PDFs.

The official PDFs remain the immutable source/download. This script extracts every
non-empty text line with Poppler (pdftotext -layout), preserves page boundaries,
and emits deterministic TypeScript consumed by the website. It never guesses or
adds pedagogical content.
"""
from __future__ import annotations

import hashlib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/data/plan-prisa-content.generated.ts"

TARGETS = [
    ("plan-7", "תוכנית הוראה — כיתה ז׳", "public/docs/plan-7-tashpaz.pdf"),
    ("prisa-7", "פריסת הוראה — כיתה ז׳", "public/docs/prisa-7-tashpaz.pdf"),
    ("plan-8", "תוכנית הוראה — כיתה ח׳", "public/docs/plan-8-tashpaz.pdf"),
    ("prisa-8", "פריסת הוראה — כיתה ח׳", "public/docs/prisa-8-tashpaz.pdf"),
    ("plan-9a", "תוכנית הוראה — כיתה ט׳", "public/docs/plan-9a-tashpaz.pdf"),
    ("prisa-9a", "פריסת הוראה — כיתה ט׳", "public/docs/prisa-9a-tashpaz.pdf"),
    ("plan-9b", "תוכנית הוראה — כיתה ט׳ — מסלול מצומצם", "public/docs/plan-9b-tashpaz.pdf"),
    ("prisa-9b", "פריסת הוראה — כיתה ט׳ — מסלול מצומצם", "public/docs/prisa-9b-tashpaz.pdf"),
]

MULTISPACE = re.compile(r"\s{2,}")
HEBREW = re.compile(r"[\u0590-\u05FF]")
BIDI_CONTROLS = re.compile(r"[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]")
ZERO_WIDTH = re.compile(r"[\u200b\u200c\u200d\ufeff]")


def clean_line(raw: str) -> str:
    text = raw.replace("\u00a0", " ")
    text = BIDI_CONTROLS.sub("", text)
    text = ZERO_WIDTH.sub("", text)
    return text.rstrip()


def extract(pdf: Path) -> str:
    proc = subprocess.run(
        ["pdftotext", "-layout", "-enc", "UTF-8", str(pdf), "-"],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    return proc.stdout.decode("utf-8", errors="strict")


def main() -> None:
    documents: dict[str, object] = {}

    for key, label, rel in TARGETS:
        pdf = ROOT / rel
        if not pdf.is_file():
            raise SystemExit(f"missing source PDF: {rel}")

        raw = extract(pdf)
        page_chunks = raw.split("\f")
        pages = []
        all_text_parts: list[str] = []

        for page_no, chunk in enumerate(page_chunks, start=1):
            rows = []
            for raw_line in chunk.splitlines():
                line = clean_line(raw_line)
                text = line.strip()
                if not text:
                    continue
                cells = [part.strip() for part in MULTISPACE.split(text) if part.strip()]
                rows.append({"text": text, "cells": cells})
                all_text_parts.append(text)
            if rows:
                pages.append({"page": page_no, "rows": rows})

        joined = "\n".join(all_text_parts)
        if len(joined) < 250:
            raise SystemExit(f"extraction suspiciously short for {rel}: {len(joined)} chars")
        if len(HEBREW.findall(joined)) < 30:
            raise SystemExit(f"extraction contains too little Hebrew for {rel}")

        digest = hashlib.sha256(pdf.read_bytes()).hexdigest()
        documents[key] = {
            "id": key,
            "label": label,
            "pdf": "/" + rel.removeprefix("public/"),
            "sha256": digest,
            "pageCount": len(pages),
            "textLength": len(joined),
            "pages": pages,
        }

    payload = {
        "schema": 1,
        "generator": "scripts/extract-plan-prisa-content.py",
        "documents": documents,
    }
    body = "// GENERATED FILE — do not hand-edit.\n"
    body += "// Source: the eight verified Tashpaz PDFs in public/docs/.\n"
    body += "export const planPrisaContent = "
    body += json.dumps(payload, ensure_ascii=False, indent=2)
    body += " as const;\n\n"
    body += "export type PlanPrisaContentKey = keyof typeof planPrisaContent.documents;\n"
    OUT.write_text(body, encoding="utf-8")
    print(f"generated {OUT.relative_to(ROOT)} with {len(documents)} documents")
    for key, doc in documents.items():
        print(f"  {key}: {doc['pageCount']} pages, {doc['textLength']} chars")


if __name__ == "__main__":
    main()
