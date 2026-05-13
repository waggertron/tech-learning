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
	expand := func(l, r int) string {
		for l >= 0 && r < len(s) && s[l] == s[r] {
			l--
			r++
		}
		return s[l+1 : r]
	}
	best := ""
	for i := 0; i < len(s); i++ {
		for _, cand := range []string{expand(i, i), expand(i, i+1)} {
			if len(cand) > len(best) {
				best = cand
			}
		}
	}
	return best
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
