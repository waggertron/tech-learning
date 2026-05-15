from __future__ import annotations
from dataclasses import dataclass, field
from typing import Protocol


class Visitor(Protocol):
    def visit_heading(self, node: Heading) -> None: ...
    def visit_paragraph(self, node: Paragraph) -> None: ...
    def visit_image(self, node: Image) -> None: ...


@dataclass
class Heading:
    level: int
    text: str

    def accept(self, visitor: Visitor) -> None:
        visitor.visit_heading(self)


@dataclass
class Paragraph:
    text: str

    def accept(self, visitor: Visitor) -> None:
        visitor.visit_paragraph(self)


@dataclass
class Image:
    src: str
    alt: str

    def accept(self, visitor: Visitor) -> None:
        visitor.visit_image(self)


class WordCountVisitor:
    def __init__(self) -> None:
        self.count = 0

    def visit_heading(self, node: Heading) -> None:
        self.count += len(node.text.split())

    def visit_paragraph(self, node: Paragraph) -> None:
        self.count += len(node.text.split())

    def visit_image(self, node: Image) -> None:
        pass  # images contribute no words


class HTMLExportVisitor:
    def __init__(self) -> None:
        self.output = ''

    def visit_heading(self, node: Heading) -> None:
        self.output += f'<h{node.level}>{node.text}</h{node.level}>\n'

    def visit_paragraph(self, node: Paragraph) -> None:
        self.output += f'<p>{node.text}</p>\n'

    def visit_image(self, node: Image) -> None:
        self.output += f'<img src="{node.src}" alt="{node.alt}">\n'


tree = [
    Heading(1, 'Hello World'),
    Paragraph('The quick brown fox'),
    Image('fox.png', 'A fox'),
    Paragraph('jumps over the lazy dog'),
]

counter = WordCountVisitor()
for node in tree:
    node.accept(counter)
print(counter.count)  # 9

exporter = HTMLExportVisitor()
for node in tree:
    node.accept(exporter)
print(exporter.output)
# <h1>Hello World</h1>
# <p>The quick brown fox</p>
# <img src="fox.png" alt="A fox">
# <p>jumps over the lazy dog</p>
