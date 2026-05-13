package main

import (
	"fmt"
	"strings"
)

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func repeatedSubstringPattern(s string) bool {
	doubled := (s + s)[1 : len(s)*2-1]
	return strings.Contains(doubled, s)
}

func runTests() {
	assert(repeatedSubstringPattern("abab") == true, "test 1")
	assert(repeatedSubstringPattern("aba") == false, "test 2")
	assert(repeatedSubstringPattern("abcabcabcabc") == true, "test 3")
	assert(repeatedSubstringPattern("a") == false, "test 4")
	assert(repeatedSubstringPattern("aa") == true, "test 5")
	assert(repeatedSubstringPattern("abaaba") == true, "test 6")
	fmt.Println("all tests pass")
}

func main() { runTests() }
