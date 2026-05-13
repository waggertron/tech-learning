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
	words := map[string]bool{}
	for _, w := range wordDict {
		words[w] = true
	}
	memo := map[int]bool{}
	var f func(start int) bool
	f = func(start int) bool {
		if start == len(s) {
			return true
		}
		if v, ok := memo[start]; ok {
			return v
		}
		for end := start + 1; end <= len(s); end++ {
			if words[s[start:end]] && f(end) {
				memo[start] = true
				return true
			}
		}
		memo[start] = false
		return false
	}
	return f(0)
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
