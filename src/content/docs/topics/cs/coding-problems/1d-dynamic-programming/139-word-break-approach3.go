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
	n := len(s)
	dp := make([]bool, n+1)
	dp[0] = true
	for i := 1; i <= n; i++ {
		for j := 0; j < i; j++ {
			if dp[j] && words[s[j:i]] {
				dp[i] = true
				break
			}
		}
	}
	return dp[n]
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
