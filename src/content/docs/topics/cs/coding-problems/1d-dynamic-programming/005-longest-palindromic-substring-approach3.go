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
	n := len(s)
	if n <= 1 {
		return s
	}
	dp := make([][]bool, n)
	for i := range dp {
		dp[i] = make([]bool, n)
	}
	best := s[0:1]
	for i := 0; i < n; i++ {
		dp[i][i] = true
	}
	for length := 2; length <= n; length++ {
		for i := 0; i <= n-length; i++ {
			j := i + length - 1
			if s[i] == s[j] && (length == 2 || dp[i+1][j-1]) {
				dp[i][j] = true
				if length > len(best) {
					best = s[i : j+1]
				}
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
