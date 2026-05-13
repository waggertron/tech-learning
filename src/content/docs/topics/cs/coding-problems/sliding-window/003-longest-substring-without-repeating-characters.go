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

func lengthOfLongestSubstring(s string) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(lengthOfLongestSubstring("abcabcbb") == 3)
	assert(lengthOfLongestSubstring("bbbbb") == 1)
	assert(lengthOfLongestSubstring("pwwkew") == 3)
	assert(lengthOfLongestSubstring("") == 0)
	assert(lengthOfLongestSubstring("a") == 1)
	assert(lengthOfLongestSubstring("abcdef") == 6)
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
