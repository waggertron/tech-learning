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

func isMatch(s string, p string) bool {
	// TODO: implement
	return false
}

func runTests() {
	assert(isMatch("aa", "a") == false)
	assert(isMatch("aa", "a*") == true)
	assert(isMatch("ab", ".*") == true)
	assert(isMatch("mississippi", "mis*is*p*.") == false)
	assert(isMatch("", "") == true)
	assert(isMatch("", "a*") == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
