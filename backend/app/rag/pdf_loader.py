"""
Step 1 of the RAG pipeline: PDF text extraction.

We extract text page-by-page (rather than as one big blob) so that every
chunk produced later can be traced back to an exact page number — this is
what powers the "source citation" feature.
"""
from dataclasses import dataclass

from pypdf import PdfReader


@dataclass
class PageText:
    page_number: int  # 1-indexed, matches how humans refer to PDF pages
    text: str


class PDFLoadError(Exception):
    """Raised when a PDF cannot be read or contains no extractable text."""


def extract_text_from_pdf(file_path: str) -> list[PageText]:
    """
    Read a PDF from disk and return a list of `PageText`, one entry per page.

    Pages with no extractable text (e.g. pure scanned images with no OCR)
    are still included with an empty string, so page numbering stays
    consistent for downstream chunking.
    """
    try:
        reader = PdfReader(file_path)
    except Exception as exc:  # noqa: BLE001 — surface any parse error uniformly
        raise PDFLoadError(f"Could not read PDF file: {exc}") from exc

    if len(reader.pages) == 0:
        raise PDFLoadError("PDF contains no pages.")

    pages: list[PageText] = []
    for i, page in enumerate(reader.pages, start=1):
        try:
            text = page.extract_text() or ""
        except Exception:  # noqa: BLE001 — a single bad page shouldn't fail the whole doc
            text = ""
        pages.append(PageText(page_number=i, text=text.strip()))

    if all(p.text == "" for p in pages):
        raise PDFLoadError(
            "No extractable text found in this PDF. It may be a scanned "
            "image without OCR."
        )

    return pages


def get_page_count(file_path: str) -> int:
    return len(PdfReader(file_path).pages)
