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

func characterReplacement(s string, k int) int {
	counts := make(map[byte]int)
	left := 0
	maxFreq := 0
	best := 0
	for right := 0; right < len(s); right++ {
		ch := s[right]
		counts[ch]++
		if counts[ch] > maxFreq {
			maxFreq = counts[ch]
		}
		for (right-left+1)-maxFreq > k {
			counts[s[left]]--
			left++
		}
		if right-left+1 > best {
			best = right - left + 1
		}
	}
	return best
}

func runTests() {
	assert(characterReplacement("ABAB", 2) == 4)
	assert(characterReplacement("AABABBA", 1) == 4)
	assert(characterReplacement("A", 0) == 1)
	assert(characterReplacement("AAAA", 2) == 4)
	assert(characterReplacement("ABCDE", 1) == 2)
	assert(characterReplacement("AABBA", 2) == 5)
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
