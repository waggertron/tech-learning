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

func firstUniqChar(s string) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(firstUniqChar("leetcode") == 0, "test 1")
	assert(firstUniqChar("loveleetcode") == 2, "test 2")
	assert(firstUniqChar("aabb") == -1, "test 3")
	assert(firstUniqChar("z") == 0, "test 4")
	assert(firstUniqChar("aab") == 2, "test 5")
	fmt.Println("all tests pass")
}

func main() { runTests() }
