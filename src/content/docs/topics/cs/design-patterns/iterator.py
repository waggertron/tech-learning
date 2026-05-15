from __future__ import annotations
from typing import Iterator


class Book:
    def __init__(self, title: str, genre: str) -> None:
        self.title = title
        self.genre = genre


class ForwardIterator(Iterator[Book]):
    def __init__(self, books: list[Book]) -> None:
        self._books = books
        self._index = 0

    def __iter__(self) -> ForwardIterator:
        return self

    def __next__(self) -> Book:
        if self._index >= len(self._books):
            raise StopIteration
        book = self._books[self._index]
        self._index += 1
        return book


class GenreIterator(Iterator[Book]):
    def __init__(self, books: list[Book], genre: str) -> None:
        self._books = [b for b in books if b.genre == genre]
        self._index = 0

    def __iter__(self) -> GenreIterator:
        return self

    def __next__(self) -> Book:
        if self._index >= len(self._books):
            raise StopIteration
        book = self._books[self._index]
        self._index += 1
        return book


class BookCollection:
    def __init__(self) -> None:
        self._books: list[Book] = []

    def add(self, book: Book) -> None:
        self._books.append(book)

    def __iter__(self) -> ForwardIterator:
        return ForwardIterator(self._books)

    def by_genre(self, genre: str) -> GenreIterator:
        return GenreIterator(self._books, genre)


collection = BookCollection()
collection.add(Book('Dune', 'sci-fi'))
collection.add(Book('Foundation', 'sci-fi'))
collection.add(Book('Shogun', 'historical'))

for book in collection:
    print(book.title)
# Dune
# Foundation
# Shogun

for book in collection.by_genre('sci-fi'):
    print(book.title)
# Dune
# Foundation
