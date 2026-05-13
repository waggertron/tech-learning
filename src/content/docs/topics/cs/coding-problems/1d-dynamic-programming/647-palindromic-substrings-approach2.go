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
	expand := func(l, r int) int {
		count := 0
		for l >= 0 && r < len(s) && s[l] == s[r] {
			count++
			l--
			r++
		}
		return count
	}
	total := 0
	for i := 0; i < len(s); i++ {
		total += expand(i, i) + expand(i, i+1)
	}
	return total
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
