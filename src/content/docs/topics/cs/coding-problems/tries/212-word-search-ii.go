package main

import (
	"fmt"
	"sort"
)

type TrieNode struct {
	Children [26]*TrieNode
	IsEnd    bool
}

func findWords(board [][]byte, words []string) []string {
	// TODO: implement
	return []string{}
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
