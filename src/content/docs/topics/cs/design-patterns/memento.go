package main

import "fmt"

// snapshot has unexported fields: only editor.go can read or write them.
type snapshot struct {
	content   string
	cursorPos int
}

type Editor struct {
	content   string
	cursorPos int
}

func (e *Editor) Type(text string) {
	e.content = e.content[:e.cursorPos] + text + e.content[e.cursorPos:]
	e.cursorPos += len(text)
}

func (e *Editor) MoveCursor(pos int) {
	if pos < 0 {
		pos = 0
	}
	if pos > len(e.content) {
		pos = len(e.content)
	}
	e.cursorPos = pos
}

func (e *Editor) Save() *snapshot {
	return &snapshot{content: e.content, cursorPos: e.cursorPos}
}

func (e *Editor) Restore(s *snapshot) {
	e.content = s.content
	e.cursorPos = s.cursorPos
}

func (e *Editor) String() string {
	return fmt.Sprintf("%q (cursor: %d)", e.content, e.cursorPos)
}

type History struct {
	stack []*snapshot
}

func (h *History) Push(s *snapshot) {
	h.stack = append(h.stack, s)
}

func (h *History) Pop() *snapshot {
	if len(h.stack) == 0 {
		return nil
	}
	last := h.stack[len(h.stack)-1]
	h.stack = h.stack[:len(h.stack)-1]
	return last
}

func main() {
	editor := &Editor{}
	history := &History{}

	history.Push(editor.Save())  // "" cursor 0
	editor.Type("Hello")
	history.Push(editor.Save())  // "Hello" cursor 5
	editor.Type(", world")
	fmt.Println(editor)          // "Hello, world" (cursor: 12)

	editor.Restore(history.Pop())
	fmt.Println(editor)          // "Hello" (cursor: 5)

	editor.Restore(history.Pop())
	fmt.Println(editor)          // "" (cursor: 0)
}
