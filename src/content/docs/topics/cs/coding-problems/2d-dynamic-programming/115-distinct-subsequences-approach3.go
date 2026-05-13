package main

import "fmt"

func numDistinct(s string, t string) int {
	m, n := len(s), len(t)
	dp := make([]int, n+1)
	dp[0] = 1
	for i := 0; i < m; i++ {
		for j := n; j >= 1; j-- {
			if s[i] == t[j-1] {
				dp[j] += dp[j-1]
			}
		}
	}
	return dp[n]
}

func main() {
	assert := func(cond bool) {
		if !cond {
			panic("assertion failed")
		}
	}
	assert(numDistinct("rabbbit", "rabbit") == 3)
	assert(numDistinct("babgbag", "bag") == 5)
	assert(numDistinct("abc", "") == 1)
	assert(numDistinct("", "a") == 0)
	assert(numDistinct("abc", "abc") == 1)
	assert(numDistinct("aaa", "b") == 0)
	fmt.Println("all tests pass")
}
