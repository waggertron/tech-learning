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

func strStr(haystack string, needle string) int {
	return strings.Index(haystack, needle)
}

func runTests() {
	assert(strStr("sadbutsad", "sad") == 0)
	assert(strStr("leetcode", "leeto") == -1)
	assert(strStr("hello", "ll") == 2)
	assert(strStr("a", "a") == 0)
	assert(strStr("mississippi", "issip") == 4)
	assert(strStr("abc", "") == 0)
	assert(strStr("", "a") == -1)
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
