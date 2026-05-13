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
	n := len(s)
	dp := make([][]bool, n)
	for i := range dp {
		dp[i] = make([]bool, n)
	}
	count := 0
	for i := 0; i < n; i++ {
		dp[i][i] = true
		count++
	}
	for length := 2; length <= n; length++ {
		for i := 0; i <= n-length; i++ {
			j := i + length - 1
			if s[i] == s[j] && (length == 2 || dp[i+1][j-1]) {
				dp[i][j] = true
				count++
			}
		}
	}
	return count
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
