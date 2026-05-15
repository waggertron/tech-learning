package main

import "fmt"

// Go has no built-in clone mechanism.
// The convention is a Clone() method on each concrete type.
// Watch for shallow vs. deep copy: pointer fields and slices share backing
// memory unless you explicitly copy them.

// --- Prototype interface ---

type Document interface {
	Clone() Document
	Title() string
}

// --- TextDocument ---

type TextDocument struct {
	title string
	body  string
	tags  []string // slice header is copied by value, but backing array is shared
}

func NewTextDocument(title, body string, tags []string) *TextDocument {
	return &TextDocument{title: title, body: body, tags: tags}
}

// Clone performs a deep copy of the mutable slice field.
func (d *TextDocument) Clone() Document {
	tagsCopy := make([]string, len(d.tags))
	copy(tagsCopy, d.tags)
	return &TextDocument{
		title: d.title,
		body:  d.body,
		tags:  tagsCopy,
	}
}

func (d *TextDocument) Title() string { return d.title }

func (d *TextDocument) AddTag(tag string) { d.tags = append(d.tags, tag) }

func (d *TextDocument) String() string {
	return fmt.Sprintf("TextDocument(%q, tags=%v)", d.title, d.tags)
}

// --- SpreadsheetDocument ---

type SpreadsheetDocument struct {
	title string
	rows  [][]int // 2D slice: outer slice AND inner slices must be copied
}

func NewSpreadsheetDocument(title string, rows [][]int) *SpreadsheetDocument {
	return &SpreadsheetDocument{title: title, rows: rows}
}

// Clone deep-copies the 2D slice.
func (s *SpreadsheetDocument) Clone() Document {
	rowsCopy := make([][]int, len(s.rows))
	for i, row := range s.rows {
		rowCopy := make([]int, len(row))
		copy(rowCopy, row)
		rowsCopy[i] = rowCopy
	}
	return &SpreadsheetDocument{title: s.title, rows: rowsCopy}
}

func (s *SpreadsheetDocument) Title() string { return s.title }

func (s *SpreadsheetDocument) String() string {
	return fmt.Sprintf("SpreadsheetDocument(%q, %d rows)", s.title, len(s.rows))
}

// --- Registry ---

type DocumentRegistry struct {
	items map[string]Document
}

func NewDocumentRegistry() *DocumentRegistry {
	return &DocumentRegistry{items: make(map[string]Document)}
}

func (r *DocumentRegistry) Register(key string, proto Document) {
	r.items[key] = proto
}

func (r *DocumentRegistry) Get(key string) (Document, error) {
	proto, ok := r.items[key]
	if !ok {
		return nil, fmt.Errorf("no prototype registered for key %q", key)
	}
	return proto.Clone(), nil
}

// --- Main ---

func main() {
	registry := NewDocumentRegistry()

	registry.Register("report", NewTextDocument(
		"Quarterly Report", "Summary goes here.", []string{"finance", "q1"},
	))

	doc1, _ := registry.Get("report")
	td1 := doc1.(*TextDocument)
	td1.title = "Q2 Report"
	td1.AddTag("q2")

	doc2, _ := registry.Get("report")
	td2 := doc2.(*TextDocument)

	fmt.Println(td1) // TextDocument("Q2 Report", tags=[finance q1 q2])
	fmt.Println(td2) // TextDocument("Quarterly Report", tags=[finance q1])

	// Shallow copy pitfall (do NOT do this):
	// bad := *td1   // copies slice header, not backing array
	// bad.tags[0] = "OOPS"  // would mutate td1.tags too
}
