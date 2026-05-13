package main

import "fmt"

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func ladderLength(beginWord string, endWord string, wordList []string) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(ladderLength("hit", "cog", []string{"hot", "dot", "dog", "lot", "log", "cog"}) == 5)
	assert(ladderLength("hit", "cot", []string{"hot", "dot", "dog", "lot", "log", "cog"}) == 0)
	assert(ladderLength("hot", "dot", []string{"dot", "lot"}) == 2)
	assert(ladderLength("hit", "cog", []string{"hot", "dot", "dog", "lot", "log"}) == 0)
	assert(ladderLength("a", "c", []string{"a", "b", "c"}) == 2)
	fmt.Println("all tests pass")
}

func main() { runTests() }
