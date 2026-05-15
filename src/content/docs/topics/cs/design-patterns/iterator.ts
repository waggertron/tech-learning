interface Book {
  title: string;
  genre: string;
}

class BookCollection implements Iterable<Book> {
  private books: Book[] = [];

  add(book: Book): void {
    this.books.push(book);
  }

  [Symbol.iterator](): Iterator<Book> {
    let index = 0;
    const books = this.books;
    return {
      next(): IteratorResult<Book> {
        if (index < books.length) {
          return { value: books[index++], done: false };
        }
        return { value: undefined as unknown as Book, done: true };
      },
    };
  }

  byGenre(genre: string): Iterable<Book> {
    const filtered = this.books.filter((b) => b.genre === genre);
    return {
      [Symbol.iterator](): Iterator<Book> {
        let index = 0;
        return {
          next(): IteratorResult<Book> {
            if (index < filtered.length) {
              return { value: filtered[index++], done: false };
            }
            return { value: undefined as unknown as Book, done: true };
          },
        };
      },
    };
  }
}

const collection = new BookCollection();
collection.add({ title: 'Dune', genre: 'sci-fi' });
collection.add({ title: 'Foundation', genre: 'sci-fi' });
collection.add({ title: 'Shogun', genre: 'historical' });

for (const book of collection) {
  console.log(book.title);
}
// Dune
// Foundation
// Shogun

for (const book of collection.byGenre('sci-fi')) {
  console.log(book.title);
}
// Dune
// Foundation
