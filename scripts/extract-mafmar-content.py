#!/usr/bin/env python3
from __future__ import annotations

from collections import defaultdict
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

import pymupdf

ROOT = Path(__file__).resolve().parents[1]
PDF = ROOT / "public/docs/hozer-mafmar-tashpaz.pdf"
OUT = ROOT / "src/data/mafmar-content.generated.ts"
REVIEW = ROOT / ".work/mafmar-web/link-map-review.json"

EXPECTED_SHA = "d188ce53916ab41e22db7dfbb8d8dc05ef127c823e02a2ae4d778fa47e17087a"
EXPECTED_PAGES = 18
EXPECTED_LOGICAL_LINKS = 58

MULTISPACE = re.compile(r"\s{2,}")
BIDI = re.compile(r"[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]")
ZERO = re.compile(r"[\u200b\u200c\u200d\ufeff]")
TOKEN = re.compile(r"[\u0590-\u05ffA-Za-z0-9]+", re.UNICODE)


def clean(value: str) -> str:
    value = value.replace("\u00a0", " ")
    value = BIDI.sub("", value)
    value = ZERO.sub("", value)
    return " ".join(value.replace("\r", " ").replace("\n", " ").split())


def token_set(value: str) -> set[str]:
    return {x.casefold() for x in TOKEN.findall(clean(value)) if x}


def overlap(a: set[str], b: set[str]) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / min(len(a), len(b))


def extract_layout_pages() -> list[list[dict]]:
    proc = subprocess.run(
        ["pdftotext", "-layout", "-enc", "UTF-8", str(PDF), "-"],
        check=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )

    raw = proc.stdout.decode("utf-8", errors="strict")
    pages: list[list[dict]] = []

    for chunk in raw.split("\f"):
        rows = []

        for raw_line in chunk.splitlines():
            line = BIDI.sub(
                "",
                ZERO.sub("", raw_line.replace("\u00a0", " "))
            ).rstrip()

            text = line.strip()
            if not text:
                continue

            cells = [
                clean(part)
                for part in MULTISPACE.split(text)
                if clean(part)
            ]

            rows.append({
                "text": clean(text),
                "cells": cells,
                "links": [],
            })

        if rows:
            pages.append(rows)

    return pages


def visual_lines(page: pymupdf.Page) -> list[dict]:
    output = []

    for block in page.get_text("dict").get("blocks", []):
        if block.get("type") != 0:
            continue

        for line in block.get("lines", []):
            spans = line.get("spans", [])
            text = clean(" ".join(str(span.get("text", "")) for span in spans))

            if not text:
                continue

            output.append({
                "text": text,
                "rect": pymupdf.Rect(line["bbox"]),
            })

    output.sort(key=lambda item: (
        round(item["rect"].y0, 1),
        item["rect"].x0,
    ))

    return output


def rect_line_text(
    page: pymupdf.Page,
    rect: pymupdf.Rect,
    lines: list[dict],
) -> str:
    candidates = []

    for line in lines:
        lr = line["rect"]
        inter = rect & lr

        coverage = (
            max(0.0, inter.get_area())
            / max(rect.get_area(), 1.0)
        )

        ydist = abs(
            ((rect.y0 + rect.y1) / 2)
            - ((lr.y0 + lr.y1) / 2)
        ) / max(page.rect.height, 1.0)

        score = coverage * 5 + (1 - min(1, ydist))
        candidates.append((score, line["text"]))

    candidates.sort(reverse=True)

    return candidates[0][1] if candidates else ""


def map_group_to_row(
    page: pymupdf.Page,
    rows: list[dict],
    rects: list[pymupdf.Rect],
    anchor: str,
    line_text: str,
):
    anchor_tokens = token_set(anchor)
    line_tokens = token_set(line_text)

    y_norm = sum(
        ((rect.y0 + rect.y1) / 2)
        for rect in rects
    ) / len(rects) / max(page.rect.height, 1.0)

    scored = []

    for index, row in enumerate(rows):
        row_tokens = token_set(row["text"])

        row_pos = (
            (index + 0.5) / len(rows)
            if len(rows) > 1
            else 0.5
        )

        position = max(
            0.0,
            1.0 - abs(row_pos - y_norm) * 2.0,
        )

        a_score = overlap(anchor_tokens, row_tokens)
        l_score = overlap(line_tokens, row_tokens)

        if anchor_tokens:
            score = (
                0.60 * a_score
                + 0.28 * l_score
                + 0.12 * position
            )
        else:
            score = (
                0.72 * l_score
                + 0.28 * position
            )

        scored.append((
            score,
            index,
            a_score,
            l_score,
            position,
        ))

    scored.sort(reverse=True)
    return scored[0], scored[:5]


def main() -> None:
    digest = hashlib.sha256(PDF.read_bytes()).hexdigest()

    if digest != EXPECTED_SHA:
        raise SystemExit(f"PDF SHA mismatch: {digest}")

    rows_by_page = extract_layout_pages()

    if len(rows_by_page) != EXPECTED_PAGES:
        raise SystemExit(
            f"Expected {EXPECTED_PAGES} extracted pages, "
            f"got {len(rows_by_page)}"
        )

    doc = pymupdf.open(PDF)

    if doc.page_count != EXPECTED_PAGES:
        raise SystemExit(
            f"Expected {EXPECTED_PAGES} PDF pages, "
            f"got {doc.page_count}"
        )

    # Important:
    # PyMuPDF exposes annotation rectangles. The historical extraction
    # established 58 logical page+URI pairs. One logical hyperlink can
    # contain several adjacent rectangles when its visible anchor wraps.
    raw_annotation_count = 0
    grouped: dict[tuple[int, str], list[pymupdf.Rect]] = defaultdict(list)

    for page_index, page in enumerate(doc):
        for link in page.get_links():
            uri = link.get("uri")
            if not uri:
                continue

            raw_annotation_count += 1
            grouped[(page_index + 1, str(uri))].append(
                pymupdf.Rect(link["from"])
            )

    if len(grouped) != EXPECTED_LOGICAL_LINKS:
        raise SystemExit(
            f"Expected {EXPECTED_LOGICAL_LINKS} logical page+URI links, "
            f"got {len(grouped)} from {raw_annotation_count} raw annotations"
        )

    occurrences = []
    review = []

    for occurrence, ((page_no, href), rects) in enumerate(
        sorted(
            grouped.items(),
            key=lambda item: (
                item[0][0],
                min(rect.y0 for rect in item[1]),
                min(rect.x0 for rect in item[1]),
                item[0][1],
            )
        ),
        start=1,
    ):
        page = doc[page_no - 1]
        rows = rows_by_page[page_no - 1]
        lines = visual_lines(page)

        anchor_parts = []
        visual_parts = []

        for rect in rects:
            fragment = clean(page.get_textbox(rect))
            if fragment and fragment not in anchor_parts:
                anchor_parts.append(fragment)

            visual = rect_line_text(page, rect, lines)
            if visual and visual not in visual_parts:
                visual_parts.append(visual)

        anchor = clean(" ".join(anchor_parts))
        visual_text = clean(" ".join(visual_parts))

        best, candidates = map_group_to_row(
            page,
            rows,
            rects,
            anchor,
            visual_text,
        )

        score, row_index, a_score, l_score, p_score = best

        record = {
            "occurrence": occurrence,
            "page": page_no,
            "row": row_index,
            "href": href,
            "anchor": anchor,
            "visualText": visual_text,
            "rawRectCount": len(rects),
            "confidence": round(score, 5),
        }

        occurrences.append(record)

        rows[row_index]["links"].append({
            "occurrence": occurrence,
            "href": href,
            "anchor": anchor,
            "rawRectCount": len(rects),
            "confidence": round(score, 5),
        })

        if score < 0.35:
            review.append({
                **record,
                "candidates": [
                    {
                        "row": candidate[1],
                        "score": round(candidate[0], 5),
                        "text": rows[candidate[1]]["text"],
                        "anchorScore": round(candidate[2], 5),
                        "lineScore": round(candidate[3], 5),
                        "positionScore": round(candidate[4], 5),
                    }
                    for candidate in candidates
                ],
            })

    total_text = sum(
        len(row["text"])
        for page_rows in rows_by_page
        for row in page_rows
    )

    if total_text < 5000:
        raise SystemExit(
            f"Suspiciously short extracted text: {total_text}"
        )

    payload = {
        "schema": 2,
        "generator": "scripts/extract-mafmar-content.py",
        "source": {
            "pdf": "/docs/hozer-mafmar-tashpaz.pdf",
            "sha256": digest,
            "pageCount": EXPECTED_PAGES,
            "textLength": total_text,
            "rawAnnotationCount": raw_annotation_count,
            "linkOccurrenceCount": len(occurrences),
            "uniqueLinkCount": len({x["href"] for x in occurrences}),
        },
        "pages": [
            {
                "page": page_index + 1,
                "rows": rows,
            }
            for page_index, rows in enumerate(rows_by_page)
        ],
    }

    OUT.parent.mkdir(parents=True, exist_ok=True)

    body = (
        "// GENERATED FILE — do not hand-edit.\n"
        "// Source: verified Mafmar Tashpaz PDF in public/docs/.\n"
        "// Raw PDF link rectangles are consolidated by page+URI "
        "according to the historical Mafmar extraction contract.\n"
        "export const mafmarContent = "
        + json.dumps(payload, ensure_ascii=False, indent=2)
        + " as const;\n"
    )

    OUT.write_text(body, encoding="utf-8")

    REVIEW.parent.mkdir(parents=True, exist_ok=True)

    REVIEW.write_text(
        json.dumps(
            {
                "rawAnnotationCount": raw_annotation_count,
                "logicalLinkCount": len(occurrences),
                "lowConfidence": review,
                "allOccurrences": occurrences,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )

    print(f"PAGES={EXPECTED_PAGES}")
    print(f"TEXT_CHARS={total_text}")
    print(f"RAW_URI_ANNOTATIONS={raw_annotation_count}")
    print(f"LOGICAL_PAGE_URI_LINKS={len(occurrences)}")
    print(f"UNIQUE_URLS={payload['source']['uniqueLinkCount']}")
    print(f"LOW_CONFIDENCE={len(review)}")
    print(f"GENERATED={OUT.relative_to(ROOT)}")

    if review:
        print(f"REVIEW_FILE={REVIEW.relative_to(ROOT)}")
        sys.exit(4)


if __name__ == "__main__":
    main()
