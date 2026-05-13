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

func isAnagram(s string, t string) bool {
	cs := make(map[rune]int)
	ct := make(map[rune]int)
	for _, ch := range s {
		cs[ch]++
	}
	for _, ch := range t {
		ct[ch]++
	}
	if len(cs) != len(ct) {
		return false
	}
	for ch, cnt := range cs {
		if ct[ch] != cnt {
			return false
		}
	}
	return true
}

func runTests() {
	assert(isAnagram("anagram", "nagaram") == true, "test 1")
	assert(isAnagram("rat", "car") == false, "test 2")
	assert(isAnagram("a", "a") == true, "test 3")
	assert(isAnagram("ab", "ba") == true, "test 4")
	assert(isAnagram("ab", "a") == false, "test 5")
	assert(isAnagram("", "") == true, "test 6")
	fmt.Println("all tests pass")
}

func main() { runTests() }
