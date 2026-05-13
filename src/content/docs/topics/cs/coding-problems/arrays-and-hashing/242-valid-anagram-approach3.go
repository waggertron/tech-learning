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
	if len(s) != len(t) {
		return false
	}
	var counts [26]int
	for _, ch := range s {
		counts[ch-'a']++
	}
	for _, ch := range t {
		idx := ch - 'a'
		counts[idx]--
		if counts[idx] < 0 {
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
