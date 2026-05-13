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
	n, m := len(s1), len(s2)
	if n > m {
		return false
	}
	target := make(map[byte]int)
	for i := 0; i < n; i++ {
		target[s1[i]]++
	}
	window := make(map[byte]int)
	for i := 0; i < n; i++ {
		window[s2[i]]++
	}
	mapsEqual := func(a, b map[byte]int) bool {
		if len(a) != len(b) {
			return false
		}
		for k, v := range a {
			if b[k] != v {
				return false
			}
		}
		return true
	}
	if mapsEqual(window, target) {
		return true
	}
	for i := n; i < m; i++ {
		window[s2[i]]++
		outCh := s2[i-n]
		window[outCh]--
		if window[outCh] == 0 {
			delete(window, outCh)
		}
		if mapsEqual(window, target) {
			return true
		}
	}
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
