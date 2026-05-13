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

func wordBreak(s string, wordDict []string) bool {
	// TODO: implement
	return false
}

func runTests() {
	assert(wordBreak("leetcode", []string{"leet", "code"}) == true)
	assert(wordBreak("applepenapple", []string{"apple", "pen"}) == true)
	assert(wordBreak("catsandog", []string{"cats", "dog", "sand", "and", "cat"}) == false)
	assert(wordBreak("a", []string{"a"}) == true)
	assert(wordBreak("a", []string{"b"}) == false)
	assert(wordBreak("aaaa", []string{"a", "aa"}) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
