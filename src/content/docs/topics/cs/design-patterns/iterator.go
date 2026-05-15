package main

import "fmt"

type Book struct {
	Title string
	Genre string
}

type Iterator interface {
	HasNext() bool
	Next() Book
}

type ForwardIterator struct {
	books []Book
	index int
}

func (it *ForwardIterator) HasNext() bool { return it.index < len(it.books) }
func (it *ForwardIterator) Next() Book {
	b := it.books[it.index]
	it.index++
	return b
}

type GenreIterator struct {
	books []Book
	index int
}

func (it *GenreIterator) HasNext() bool { return it.index < len(it.books) }
func (it *GenreIterator) Next() Book {
	b := it.books[it.index]
	it.index++
	return b
}

type BookCollection struct {
	books []Book
}

func (c *BookCollection) Add(b Book) { c.books = append(c.books, b) }

func (c *BookCollection) CreateIterator() Iterator {
	return &ForwardIterator{books: c.books}
}

func (c *BookCollection) CreateGenreIterator(genre string) Iterator {
	var filtered []Book
	for _, b := range c.books {
		if b.Genre == genre {
			filtered = append(filtered, b)
		}
	}
	return &GenreIterator{books: filtered}
}

func main() {
	collection := &BookCollection{}
	collection.Add(Book{Title: "Dune", Genre: "sci-fi"})
	collection.Add(Book{Title: "Foundation", Genre: "sci-fi"})
	collection.Add(Book{Title: "Shogun", Genre: "historical"})

	it := collection.CreateIterator()
	for it.HasNext() {
		fmt.Println(it.Next().Title)
	}
	// Dune
	// Foundation
	// Shogun

	genre := collection.CreateGenreIterator("sci-fi")
	for genre.HasNext() {
		fmt.Println(genre.Next().Title)
	}
	// Dune
	// Foundation
}
