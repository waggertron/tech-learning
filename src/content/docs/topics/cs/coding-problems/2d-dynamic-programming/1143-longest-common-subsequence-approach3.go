package main

import "fmt"

func longestCommonSubsequence(text1 string, text2 string) int {
	max := func(a, b int) int {
		if a > b {
			return a
		}
		return b
	}
	m, n := len(text1), len(text2)
	if m < n {
		text1, text2 = text2, text1
		m, n = n, m
	}
	prev := make([]int, n+1)
	for i := 1; i <= m; i++ {
		curr := make([]int, n+1)
		for j := 1; j <= n; j++ {
			if text1[i-1] == text2[j-1] {
				curr[j] = 1 + prev[j-1]
			} else {
				curr[j] = max(prev[j], curr[j-1])
			}
		}
		prev = curr
	}
	return prev[n]
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
