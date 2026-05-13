package main

import "fmt"

func longestCommonSubsequence(text1 string, text2 string) int {
	m, n := len(text1), len(text2)
	dp := make([][]int, m+1)
	for i := range dp {
		dp[i] = make([]int, n+1)
	}
	for i := 1; i <= m; i++ {
		for j := 1; j <= n; j++ {
			if text1[i-1] == text2[j-1] {
				dp[i][j] = 1 + dp[i-1][j-1]
			} else {
				if dp[i-1][j] > dp[i][j-1] {
					dp[i][j] = dp[i-1][j]
				} else {
					dp[i][j] = dp[i][j-1]
				}
			}
		}
	}
	return dp[m][n]
}

func main() {
	assert := func(cond bool) {
		if !cond {
			panic("assertion failed")
		}
	}
	assert(longestCommonSubsequence("abcde", "ace") == 3)
	assert(longestCommonSubsequence("abc", "abc") == 3)
	assert(longestCommonSubsequence("abc", "def") == 0)
	assert(longestCommonSubsequence("", "abc") == 0)
	assert(longestCommonSubsequence("abc", "") == 0)
	assert(longestCommonSubsequence("a", "a") == 1)
	fmt.Println("all tests pass")
}
