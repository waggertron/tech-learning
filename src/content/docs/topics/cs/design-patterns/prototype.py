from __future__ import annotations
import copy
from typing import Protocol, runtime_checkable


@runtime_checkable
class Cloneable(Protocol):
    def clone(self) -> Cloneable:
        ...


class TextDocument:
    def __init__(self, title: str, body: str, tags: list[str]) -> None:
        self.title = title
        self.body = body
        self.tags = tags

    def clone(self) -> TextDocument:
        # copy.deepcopy handles nested mutable state automatically
        return copy.deepcopy(self)

    # Optional: support copy.copy() / copy.deepcopy() protocol directly
    def __copy__(self) -> TextDocument:
        return TextDocument(self.title, self.body, list(self.tags))

    def __deepcopy__(self, memo: dict) -> TextDocument:
        return TextDocument(
            copy.deepcopy(self.title, memo),
            copy.deepcopy(self.body, memo),
            copy.deepcopy(self.tags, memo),
        )

    def __repr__(self) -> str:
        return f'TextDocument("{self.title}", tags={self.tags})'


class SpreadsheetDocument:
    def __init__(self, title: str, rows: list[list[int]]) -> None:
        self.title = title
        self.rows = rows

    def clone(self) -> SpreadsheetDocument:
        return copy.deepcopy(self)

    def __repr__(self) -> str:
        return f'SpreadsheetDocument("{self.title}", {len(self.rows)} rows)'


# --- Registry ---

class DocumentRegistry:
    def __init__(self) -> None:
        self._items: dict[str, Cloneable] = {}

    def register(self, key: str, prototype: Cloneable) -> None:
        self._items[key] = prototype

    def get(self, key: str) -> Cloneable:
        try:
            return self._items[key].clone()
        except KeyError:
            raise KeyError(f"No prototype registered for key '{key}'")


# --- Usage ---

registry = DocumentRegistry()

registry.register(
    "report",
    TextDocument("Quarterly Report", "Summary goes here.", ["finance", "q1"]),
)

doc1 = registry.get("report")
assert isinstance(doc1, TextDocument)
doc1.title = "Q2 Report"
doc1.tags.append("q2")

doc2 = registry.get("report")
assert isinstance(doc2, TextDocument)

print(doc1)  # TextDocument("Q2 Report", tags=['finance', 'q1', 'q2'])
print(doc2)  # TextDocument("Quarterly Report", tags=['finance', 'q1'])
