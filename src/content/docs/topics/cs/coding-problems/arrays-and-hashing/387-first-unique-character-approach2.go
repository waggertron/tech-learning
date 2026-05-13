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
	counts := make(map[rune]int)
	for _, ch := range s {
		counts[ch]++
	}
	for i, ch := range s {
		if counts[ch] == 1 {
			return i
		}
	}
	return -1
}

func runTests() {
	assert(firstUniqChar("leetcode") == 0, "test 1")
	assert(firstUniqChar("loveleetcode") == 2, "test 2")
	assert(firstUniqChar("aabb") == -1, "test 3")
	assert(firstUniqChar("z") == 0, "test 4")
	assert(firstUniqChar("aab") == 2, "test 5")
	assert(firstUniqChar("cc") == -1, "test 6")
	fmt.Println("all tests pass")
}

func main() { runTests() }
