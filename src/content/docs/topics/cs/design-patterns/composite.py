from __future__ import annotations
from abc import ABC, abstractmethod


class FileSystemItem(ABC):
    @abstractmethod
    def get_size(self) -> int: ...

    @abstractmethod
    def get_name(self) -> str: ...


class File(FileSystemItem):
    def __init__(self, name: str, size: int) -> None:
        self._name = name
        self._size = size

    def get_size(self) -> int:
        return self._size

    def get_name(self) -> str:
        return self._name

    def __repr__(self) -> str:
        return f'File({self._name!r}, {self._size}B)'


class Directory(FileSystemItem):
    def __init__(self, name: str) -> None:
        self._name = name
        self._children: list[FileSystemItem] = []

    def add(self, item: FileSystemItem) -> None:
        self._children.append(item)

    def remove(self, item: FileSystemItem) -> None:
        self._children.remove(item)

    def get_size(self) -> int:
        return sum(child.get_size() for child in self._children)

    def get_name(self) -> str:
        return self._name

    def __repr__(self) -> str:
        return f'Directory({self._name!r}, children={self._children!r})'


root = Directory('root')
src = Directory('src')
src.add(File('index.py', 1200))
src.add(File('utils.py', 800))

assets = Directory('assets')
assets.add(File('logo.png', 45000))

root.add(src)
root.add(assets)
root.add(File('README.md', 300))

print(root.get_size())   # 47300
print(src.get_size())    # 2000
print(repr(src))
# Directory('src', children=[File('index.py', 1200B), File('utils.py', 800B)])
