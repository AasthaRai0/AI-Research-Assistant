"""
Step 2 of the RAG pipeline: chunking.

Long documents can't be embedded or fed to an LLM as a single block, so we
split each page's text into overlapping chunks. The overlap (CHUNK_OVERLAP)
prevents a sentence that straddles a chunk boundary from losing context.

We use LangChain's RecursiveCharacterTextSplitter, which tries to split on
paragraph breaks first, then sentences, then words — so chunks stay
semantically coherent instead of being cut mid-sentence whenever possible.
Each resulting chunk keeps a reference to the page it came from, which is
what lets us cite an exact page number later in the pipeline.
"""
from dataclasses import dataclass

from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config.settings import settings
from app.rag.pdf_loader import PageText


@dataclass
class Chunk:
    text: str
    page_number: int
    chunk_index: int  # position within the document, useful for debugging/ordering


def split_pages_into_chunks(pages: list[PageText]) -> list[Chunk]:
    """Turn extracted page text into overlapping, page-tagged chunks."""
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.CHUNK_SIZE,
        chunk_overlap=settings.CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
    )

    chunks: list[Chunk] = []
    running_index = 0
    for page in pages:
        if not page.text:
            continue
        for piece in splitter.split_text(page.text):
            chunks.append(
                Chunk(text=piece, page_number=page.page_number, chunk_index=running_index)
            )
            running_index += 1

    return chunks
