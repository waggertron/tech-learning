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

func minDistance(word1 string, word2 string) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(minDistance("horse", "ros") == 3)
	assert(minDistance("intention", "execution") == 5)
	assert(minDistance("", "") == 0)
	assert(minDistance("abc", "") == 3)
	assert(minDistance("", "abc") == 3)
	assert(minDistance("abc", "abc") == 0)
	fmt.Println("all tests pass")
}

func main() { runTests() }
