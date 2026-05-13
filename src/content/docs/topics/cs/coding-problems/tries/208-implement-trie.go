package main

import "fmt"

type TrieNode struct {
	Children [26]*TrieNode
	IsEnd    bool
}

type Trie struct {
	Root *TrieNode
}

func NewTrie() *Trie {
	return &Trie{Root: &TrieNode{}}
}

func (t *Trie) Insert(word string) {
	// TODO: implement
}

func (t *Trie) Search(word string) bool {
	// TODO: implement
	return false
}

func (t *Trie) StartsWith(prefix string) bool {
	// TODO: implement
	return false
}

func (t *Trie) walk(s string) *TrieNode {
	// TODO: implement
	return nil
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
	t := NewTrie()
	t.Insert("apple")
	assert(t.Search("apple") == true)
	assert(t.Search("app") == false)
	assert(t.StartsWith("app") == true)
	t.Insert("app")
	assert(t.Search("app") == true)
	assert(t.Search("ap") == false)
	assert(t.StartsWith("b") == false)
	fmt.Println("all tests pass")
}

func main() { runTests() }
