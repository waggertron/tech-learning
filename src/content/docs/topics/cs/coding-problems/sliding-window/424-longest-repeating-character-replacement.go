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

func characterReplacement(s string, k int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(characterReplacement("ABAB", 2) == 4)
	assert(characterReplacement("AABABBA", 1) == 4)
	assert(characterReplacement("A", 0) == 1)
	assert(characterReplacement("AAAA", 2) == 4)
	assert(characterReplacement("ABCDE", 1) == 2)
	assert(characterReplacement("AABBA", 2) == 5)
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
