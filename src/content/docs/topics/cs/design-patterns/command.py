from __future__ import annotations
from abc import ABC, abstractmethod


class Command(ABC):
    @abstractmethod
    def execute(self) -> None: ...

    @abstractmethod
    def undo(self) -> None: ...


class TextEditor:
    def __init__(self) -> None:
        self._content = ''

    def get_content(self) -> str:
        return self._content

    def insert(self, text: str, pos: int) -> None:
        self._content = self._content[:pos] + text + self._content[pos:]

    def delete(self, pos: int, length: int) -> None:
        self._content = self._content[:pos] + self._content[pos + length:]


class InsertCommand(Command):
    def __init__(self, editor: TextEditor, text: str, position: int) -> None:
        self._editor = editor
        self._text = text
        self._position = position

    def execute(self) -> None:
        self._editor.insert(self._text, self._position)

    def undo(self) -> None:
        self._editor.delete(self._position, len(self._text))


class DeleteCommand(Command):
    def __init__(self, editor: TextEditor, position: int, length: int) -> None:
        self._editor = editor
        self._position = position
        self._length = length
        self._deleted = ''

    def execute(self) -> None:
        content = self._editor.get_content()
        self._deleted = content[self._position:self._position + self._length]
        self._editor.delete(self._position, self._length)

    def undo(self) -> None:
        self._editor.insert(self._deleted, self._position)


class CommandHistory:
    def __init__(self) -> None:
        self._history: list[Command] = []
        self._cursor = -1

    def execute(self, cmd: Command) -> None:
        self._history = self._history[:self._cursor + 1]
        cmd.execute()
        self._history.append(cmd)
        self._cursor += 1

    def undo(self) -> None:
        if self._cursor < 0:
            return
        self._history[self._cursor].undo()
        self._cursor -= 1

    def redo(self) -> None:
        if self._cursor >= len(self._history) - 1:
            return
        self._cursor += 1
        self._history[self._cursor].execute()


editor = TextEditor()
history = CommandHistory()

history.execute(InsertCommand(editor, 'Hello, ', 0))
history.execute(InsertCommand(editor, 'world', 7))
print(editor.get_content())  # Hello, world

history.undo()
print(editor.get_content())  # Hello,

history.redo()
print(editor.get_content())  # Hello, world
