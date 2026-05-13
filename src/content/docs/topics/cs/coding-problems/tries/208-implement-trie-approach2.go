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
	node := t.Root
	for _, ch := range word {
		i := ch - 'a'
		if node.Children[i] == nil {
			node.Children[i] = &TrieNode{}
		}
		node = node.Children[i]
	}
	node.IsEnd = true
}

func (t *Trie) Search(word string) bool {
	node := t.walk(word)
	return node != nil && node.IsEnd
}

func (t *Trie) StartsWith(prefix string) bool {
	return t.walk(prefix) != nil
}

func (t *Trie) walk(s string) *TrieNode {
	node := t.Root
	for _, ch := range s {
		i := ch - 'a'
		if node.Children[i] == nil {
			return nil
		}
		node = node.Children[i]
	}
	return node
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
