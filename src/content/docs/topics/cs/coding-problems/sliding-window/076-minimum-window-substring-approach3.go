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

func minWindow(s string, t string) string {
	if s == "" || t == "" {
		return ""
	}
	need := make(map[byte]int)
	for i := 0; i < len(t); i++ {
		need[t[i]]++
	}
	needed := len(need)
	window := make(map[byte]int)
	have := 0
	left := 0
	bestLen := 1<<63 - 1
	bestL, bestR := 0, 0

	for right := 0; right < len(s); right++ {
		ch := s[right]
		window[ch]++
		if cnt, ok := need[ch]; ok && window[ch] == cnt {
			have++
		}
		for have == needed {
			if right-left+1 < bestLen {
				bestLen = right - left + 1
				bestL = left
				bestR = right
			}
			lch := s[left]
			window[lch]--
			if cnt, ok := need[lch]; ok && window[lch] < cnt {
				have--
			}
			left++
		}
	}
	if bestLen == 1<<63-1 {
		return ""
	}
	return s[bestL : bestR+1]
}

func runTests() {
	assert(minWindow("ADOBECODEBANC", "ABC") == "BANC")
	assert(minWindow("a", "a") == "a")
	assert(minWindow("a", "aa") == "")
	assert(minWindow("", "a") == "")
	assert(minWindow("abc", "") == "")
	assert(minWindow("aa", "aa") == "aa")
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
