package main

import "fmt"

// Approach 3: hash-map children via Go map (arbitrary alphabet)
// Note: Go's idiomatic trie for lowercase-only uses [26]*TrieNode (see approach2).
// This variant uses map[rune]*TrieNode to mirror the hash-map approach from Python/TS.

type TrieNode struct {
	Children map[rune]*TrieNode
	IsEnd    bool
}

func newTrieNode() *TrieNode {
	return &TrieNode{Children: make(map[rune]*TrieNode)}
}

type Trie struct {
	Root *TrieNode
}

func NewTrie() *Trie {
	return &Trie{Root: newTrieNode()}
}

func (t *Trie) Insert(word string) {
	node := t.Root
	for _, ch := range word {
		if node.Children[ch] == nil {
			node.Children[ch] = newTrieNode()
		}
		node = node.Children[ch]
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
		if node.Children[ch] == nil {
			return nil
		}
		node = node.Children[ch]
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
