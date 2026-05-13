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

func longestPalindrome(s string) string {
	// TODO: implement
	return ""
}

func runTests() {
	r := longestPalindrome("babad")
	assert(r == "bab" || r == "aba")
	assert(longestPalindrome("cbbd") == "bb")
	assert(longestPalindrome("a") == "a")
	r2 := longestPalindrome("ac")
	assert(r2 == "a" || r2 == "c")
	assert(longestPalindrome("racecar") == "racecar")
	assert(longestPalindrome("abacaba") == "abacaba")
	fmt.Println("all tests pass")
}

func main() { runTests() }
