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

func longestCommonSubsequence(text1 string, text2 string) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(longestCommonSubsequence("abcde", "ace") == 3)
	assert(longestCommonSubsequence("abc", "abc") == 3)
	assert(longestCommonSubsequence("abc", "def") == 0)
	assert(longestCommonSubsequence("", "abc") == 0)
	assert(longestCommonSubsequence("abc", "") == 0)
	assert(longestCommonSubsequence("a", "a") == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
