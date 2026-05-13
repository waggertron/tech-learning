package main

import (
	"fmt"
	"sort"
)

// Approach 3: Trie + board DFS + dead-branch pruning

type TrieNode struct {
	Children [26]*TrieNode
	Word     string // non-empty at terminal nodes
}

func findWords(board [][]byte, words []string) []string {
	root := &TrieNode{}
	for _, w := range words {
		node := root
		for _, ch := range w {
			i := ch - 'a'
			if node.Children[i] == nil {
				node.Children[i] = &TrieNode{}
			}
			node = node.Children[i]
		}
		node.Word = w
	}

	rows, cols := len(board), len(board[0])
	var found []string

	var dfs func(r, c int, node *TrieNode)
	dfs = func(r, c int, node *TrieNode) {
		if r < 0 || r >= rows || c < 0 || c >= cols {
			return
		}
		ch := board[r][c]
		if ch == '#' {
			return
		}
		i := ch - 'a'
		if node.Children[i] == nil {
			return
		}
		next := node.Children[i]
		if next.Word != "" {
			found = append(found, next.Word)
			next.Word = ""
		}
		board[r][c] = '#'
		dfs(r+1, c, next)
		dfs(r-1, c, next)
		dfs(r, c+1, next)
		dfs(r, c-1, next)
		board[r][c] = ch
		// Dead-branch pruning: remove leaf with no children and no word
		if next.Word == "" && allNil(next.Children[:]) {
			node.Children[i] = nil
		}
	}

	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			dfs(r, c, root)
		}
	}
	return found
}

func allNil(children []*TrieNode) bool {
	for _, c := range children {
		if c != nil {
			return false
		}
	}
	return true
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

func setsEqual(a, b []string) bool {
	if len(a) != len(b) {
		return false
	}
	sort.Strings(a)
	sort.Strings(b)
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

func strBoard(rows [][]string) [][]byte {
	b := make([][]byte, len(rows))
	for i, row := range rows {
		b[i] = make([]byte, len(row))
		for j, s := range row {
			b[i][j] = s[0]
		}
	}
	return b
}

func runTests() {
	board1 := strBoard([][]string{{"o", "a", "a", "n"}, {"e", "t", "a", "e"}, {"i", "h", "k", "r"}, {"i", "f", "l", "v"}})
	assert(setsEqual(findWords(board1, []string{"oath", "pea", "eat", "rain"}), []string{"eat", "oath"}))
	assert(setsEqual(findWords([][]byte{{'a'}}, []string{"a"}), []string{"a"}))
	assert(setsEqual(findWords([][]byte{{'a'}}, []string{"b"}), []string{}))
	board2 := strBoard([][]string{{"a", "b"}, {"c", "d"}})
	assert(setsEqual(findWords(board2, []string{"ab", "cd", "abdc"}), []string{"ab", "abdc", "cd"}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
