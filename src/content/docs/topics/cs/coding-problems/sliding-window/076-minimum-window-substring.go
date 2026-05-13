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

func minWindow(s string, t string) string {
	// TODO: implement
	return ""
}

func runTests() {
	assert(minWindow("ADOBECODEBANC", "ABC") == "BANC")
	assert(minWindow("a", "a") == "a")
	assert(minWindow("a", "aa") == "")
	assert(minWindow("", "a") == "")
	assert(minWindow("abc", "") == "")
	assert(minWindow("aa", "aa") == "aa")
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
