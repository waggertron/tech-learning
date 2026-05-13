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

func isInterleave(s1 string, s2 string, s3 string) bool {
	// TODO: implement
	return false
}

func runTests() {
	assert(isInterleave("aabcc", "dbbca", "aadbbcbcac") == true)
	assert(isInterleave("aabcc", "dbbca", "aadbbbaccc") == false)
	assert(isInterleave("", "", "") == true)
	assert(isInterleave("a", "", "a") == true)
	assert(isInterleave("", "b", "b") == true)
	assert(isInterleave("a", "b", "abc") == false)
	fmt.Println("all tests pass")
}

func main() { runTests() }
