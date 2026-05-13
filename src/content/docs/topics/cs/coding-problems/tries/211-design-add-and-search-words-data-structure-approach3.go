package main

import "fmt"

// Approach 3: Trie with DFS wildcard (canonical)

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
	node := wd.Root
	for _, ch := range word {
		i := ch - 'a'
		if node.Children[i] == nil {
			node.Children[i] = &TrieNode{}
		}
		node = node.Children[i]
	}
	node.IsEnd = true
}

func (wd *WordDictionary) Search(word string) bool {
	return wd.dfs(0, wd.Root, word)
}

func (wd *WordDictionary) dfs(idx int, node *TrieNode, word string) bool {
	if idx == len(word) {
		return node.IsEnd
	}
	ch := word[idx]
	if ch == '.' {
		for _, child := range node.Children {
			if child != nil && wd.dfs(idx+1, child, word) {
				return true
			}
		}
		return false
	}
	i := ch - 'a'
	if node.Children[i] == nil {
		return false
	}
	return wd.dfs(idx+1, node.Children[i], word)
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
