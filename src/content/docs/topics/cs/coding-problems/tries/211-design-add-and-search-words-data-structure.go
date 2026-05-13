package main

import "fmt"

type TrieNode struct {
	Children [26]*TrieNode
	IsEnd    bool
}

type WordDictionary struct {
	Root *TrieNode
}

func NewWordDictionary() *WordDictionary {
	return &WordDictionary{Root: &TrieNode{}}
}

func (wd *WordDictionary) AddWord(word string) {
	// TODO: implement
}

func (wd *WordDictionary) Search(word string) bool {
	// TODO: implement
	return false
}

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func runTests() {
	wd := NewWordDictionary()
	wd.AddWord("bad")
	wd.AddWord("dad")
	wd.AddWord("mad")
	assert(wd.Search("pad") == false)
	assert(wd.Search("bad") == true)
	assert(wd.Search(".ad") == true)
	assert(wd.Search("b..") == true)
	assert(wd.Search("...") == true)
	assert(wd.Search("....") == false)
	fmt.Println("all tests pass")
}

func main() { runTests() }
