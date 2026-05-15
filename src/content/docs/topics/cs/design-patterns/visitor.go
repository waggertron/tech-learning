package main

import (
	"fmt"
	"strings"
)

type Visitor interface {
	VisitHeading(n *Heading)
	VisitParagraph(n *Paragraph)
	VisitImage(n *Image)
}

type Node interface {
	Accept(v Visitor)
}

type Heading struct {
	Level int
	Text  string
}

func (h *Heading) Accept(v Visitor) { v.VisitHeading(h) }

type Paragraph struct{ Text string }

func (p *Paragraph) Accept(v Visitor) { v.VisitParagraph(p) }

type Image struct {
	Src string
	Alt string
}

func (i *Image) Accept(v Visitor) { v.VisitImage(i) }

// WordCountVisitor -----------------------------------------------------------

type WordCountVisitor struct{ Count int }

func (w *WordCountVisitor) VisitHeading(n *Heading) {
	w.Count += len(strings.Fields(n.Text))
}
func (w *WordCountVisitor) VisitParagraph(n *Paragraph) {
	w.Count += len(strings.Fields(n.Text))
}
func (w *WordCountVisitor) VisitImage(_ *Image) {}

// HTMLExportVisitor ----------------------------------------------------------

type HTMLExportVisitor struct{ Output strings.Builder }

func (h *HTMLExportVisitor) VisitHeading(n *Heading) {
	fmt.Fprintf(&h.Output, "<h%d>%s</h%d>\n", n.Level, n.Text, n.Level)
}
func (h *HTMLExportVisitor) VisitParagraph(n *Paragraph) {
	fmt.Fprintf(&h.Output, "<p>%s</p>\n", n.Text)
}
func (h *HTMLExportVisitor) VisitImage(n *Image) {
	fmt.Fprintf(&h.Output, `<img src="%s" alt="%s">`+"\n", n.Src, n.Alt)
}

func main() {
	tree := []Node{
		&Heading{Level: 1, Text: "Hello World"},
		&Paragraph{Text: "The quick brown fox"},
		&Image{Src: "fox.png", Alt: "A fox"},
		&Paragraph{Text: "jumps over the lazy dog"},
	}

	counter := &WordCountVisitor{}
	for _, node := range tree {
		node.Accept(counter)
	}
	fmt.Println(counter.Count) // 9

	exporter := &HTMLExportVisitor{}
	for _, node := range tree {
		node.Accept(exporter)
	}
	fmt.Print(exporter.Output.String())
	// <h1>Hello World</h1>
	// <p>The quick brown fox</p>
	// <img src="fox.png" alt="A fox">
	// <p>jumps over the lazy dog</p>
}
