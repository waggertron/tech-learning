package main

import "fmt"

type Command interface {
	Execute()
	Undo()
}

type TextEditor struct {
	content string
}

func (e *TextEditor) GetContent() string { return e.content }

func (e *TextEditor) Insert(text string, pos int) {
	e.content = e.content[:pos] + text + e.content[pos:]
}

func (e *TextEditor) Delete(pos, length int) {
	e.content = e.content[:pos] + e.content[pos+length:]
}

type InsertCommand struct {
	editor   *TextEditor
	text     string
	position int
}

func (c *InsertCommand) Execute() { c.editor.Insert(c.text, c.position) }
func (c *InsertCommand) Undo()    { c.editor.Delete(c.position, len(c.text)) }

type DeleteCommand struct {
	editor   *TextEditor
	position int
	length   int
	deleted  string
}

func (c *DeleteCommand) Execute() {
	content := c.editor.GetContent()
	c.deleted = content[c.position : c.position+c.length]
	c.editor.Delete(c.position, c.length)
}

func (c *DeleteCommand) Undo() { c.editor.Insert(c.deleted, c.position) }

type CommandHistory struct {
	history []Command
	cursor  int
}

func NewHistory() *CommandHistory { return &CommandHistory{cursor: -1} }

func (h *CommandHistory) Execute(cmd Command) {
	h.history = h.history[:h.cursor+1]
	cmd.Execute()
	h.history = append(h.history, cmd)
	h.cursor++
}

func (h *CommandHistory) Undo() {
	if h.cursor < 0 {
		return
	}
	h.history[h.cursor].Undo()
	h.cursor--
}

func (h *CommandHistory) Redo() {
	if h.cursor >= len(h.history)-1 {
		return
	}
	h.cursor++
	h.history[h.cursor].Execute()
}

func main() {
	editor := &TextEditor{}
	history := NewHistory()

	history.Execute(&InsertCommand{editor, "Hello, ", 0})
	history.Execute(&InsertCommand{editor, "world", 7})
	fmt.Println(editor.GetContent()) // Hello, world

	history.Undo()
	fmt.Println(editor.GetContent()) // Hello,

	history.Redo()
	fmt.Println(editor.GetContent()) // Hello, world
}
