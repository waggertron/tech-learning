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

func numDistinct(s string, t string) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(numDistinct("rabbbit", "rabbit") == 3)
	assert(numDistinct("babgbag", "bag") == 5)
	assert(numDistinct("abc", "") == 1)
	assert(numDistinct("", "a") == 0)
	assert(numDistinct("abc", "abc") == 1)
	assert(numDistinct("aaa", "b") == 0)
	fmt.Println("all tests pass")
}

func main() { runTests() }
