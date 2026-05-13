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

func countSubstrings(s string) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(countSubstrings("abc") == 3)
	assert(countSubstrings("aaa") == 6)
	assert(countSubstrings("a") == 1)
	assert(countSubstrings("aa") == 3)
	assert(countSubstrings("abba") == 6)
	assert(countSubstrings("racecar") == 10)
	fmt.Println("all tests pass")
}

func main() { runTests() }
