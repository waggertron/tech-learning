package main

import "fmt"

type Handler interface {
	SetNext(h Handler) Handler
	Handle(request string) string
}

type BaseHandler struct {
	next Handler
}

func (b *BaseHandler) SetNext(h Handler) Handler {
	b.next = h
	return h
}

func (b *BaseHandler) Handle(request string) string {
	if b.next != nil {
		return b.next.Handle(request)
	}
	return ""
}

type Level1Support struct{ BaseHandler }

func (h *Level1Support) Handle(request string) string {
	if request == "password-reset" {
		return "Level 1 resolved: password reset"
	}
	return h.BaseHandler.Handle(request)
}

type Level2Support struct{ BaseHandler }

func (h *Level2Support) Handle(request string) string {
	if request == "billing-dispute" {
		return "Level 2 resolved: billing dispute"
	}
	return h.BaseHandler.Handle(request)
}

type Level3Support struct{ BaseHandler }

func (h *Level3Support) Handle(request string) string {
	if request == "data-corruption" {
		return "Level 3 resolved: data corruption"
	}
	return h.BaseHandler.Handle(request)
}

func main() {
	l1 := &Level1Support{}
	l2 := &Level2Support{}
	l3 := &Level3Support{}
	l1.SetNext(l2).SetNext(l3)

	fmt.Println(l1.Handle("password-reset"))  // Level 1 resolved: password reset
	fmt.Println(l1.Handle("billing-dispute")) // Level 2 resolved: billing dispute
	fmt.Println(l1.Handle("data-corruption")) // Level 3 resolved: data corruption
	fmt.Println(l1.Handle("unknown"))         // (empty string)
}
