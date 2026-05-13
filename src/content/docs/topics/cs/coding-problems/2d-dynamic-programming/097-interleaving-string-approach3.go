package main

import "fmt"

func isInterleave(s1 string, s2 string, s3 string) bool {
	m, n := len(s1), len(s2)
	if m+n != len(s3) {
		return false
	}
	dp := make([][]bool, m+1)
	for i := range dp {
		dp[i] = make([]bool, n+1)
	}
	dp[0][0] = true
	for i := 0; i <= m; i++ {
		for j := 0; j <= n; j++ {
			if i == 0 && j == 0 {
				continue
			}
			k := i + j - 1
			if i > 0 && s1[i-1] == s3[k] && dp[i-1][j] {
				dp[i][j] = true
			}
			if !dp[i][j] && j > 0 && s2[j-1] == s3[k] && dp[i][j-1] {
				dp[i][j] = true
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
	assert(isInterleave("aabcc", "dbbca", "aadbbcbcac") == true)
	assert(isInterleave("aabcc", "dbbca", "aadbbbaccc") == false)
	assert(isInterleave("", "", "") == true)
	assert(isInterleave("a", "", "a") == true)
	assert(isInterleave("", "b", "b") == true)
	assert(isInterleave("a", "b", "abc") == false)
	fmt.Println("all tests pass")
}
