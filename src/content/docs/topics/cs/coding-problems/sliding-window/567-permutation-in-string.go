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

func checkInclusion(s1 string, s2 string) bool {
	// TODO: implement
	return false
}

func runTests() {
	assert(checkInclusion("ab", "eidbaooo") == true)
	assert(checkInclusion("ab", "eidboaoo") == false)
	assert(checkInclusion("a", "a") == true)
	assert(checkInclusion("a", "b") == false)
	assert(checkInclusion("abc", "ab") == false)
	assert(checkInclusion("aab", "aabc") == true)
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
