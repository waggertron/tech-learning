from __future__ import annotations
from dataclasses import dataclass


@dataclass
class Snapshot:
    # Prefixed with _ to signal: Caretaker should not inspect these.
    _content: str
    _cursor_pos: int


class Editor:
    def __init__(self) -> None:
        self._content: str = ''
        self._cursor_pos: int = 0

    def type(self, text: str) -> None:
        self._content = (
            self._content[: self._cursor_pos]
            + text
            + self._content[self._cursor_pos :]
        )
        self._cursor_pos += len(text)

    def move_cursor(self, pos: int) -> None:
        self._cursor_pos = max(0, min(pos, len(self._content)))

    def save(self) -> Snapshot:
        return Snapshot(self._content, self._cursor_pos)

    def restore(self, snapshot: Snapshot) -> None:
        self._content = snapshot._content
        self._cursor_pos = snapshot._cursor_pos

    def __str__(self) -> str:
        return f'"{self._content}" (cursor: {self._cursor_pos})'


class History:
    def __init__(self) -> None:
        self._stack: list[Snapshot] = []

    def push(self, snapshot: Snapshot) -> None:
        self._stack.append(snapshot)

    def pop(self) -> Snapshot | None:
        return self._stack.pop() if self._stack else None


editor = Editor()
history = History()

history.push(editor.save())     # "" cursor 0
editor.type('Hello')
history.push(editor.save())     # "Hello" cursor 5
editor.type(', world')
print(editor)                   # "Hello, world" (cursor: 12)

prev = history.pop()
if prev:
    editor.restore(prev)
print(editor)                   # "Hello" (cursor: 5)

initial = history.pop()
if initial:
    editor.restore(initial)
print(editor)                   # "" (cursor: 0)
