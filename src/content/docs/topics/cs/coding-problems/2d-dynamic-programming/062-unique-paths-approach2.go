package main

import "fmt"

func uniquePaths(m int, n int) int {
	dp := make([][]int, m)
	for i := range dp {
		dp[i] = make([]int, n)
		for j := range dp[i] {
			dp[i][j] = 1
		}
	}
	for r := 1; r < m; r++ {
		for c := 1; c < n; c++ {
			dp[r][c] = dp[r-1][c] + dp[r][c-1]
		}
	}
	return dp[m-1][n-1]
}

func main() {
	assert := func(cond bool) {
		if !cond {
			panic("assertion failed")
		}
	}
	assert(uniquePaths(3, 7) == 28)
	assert(uniquePaths(3, 2) == 3)
	assert(uniquePaths(1, 1) == 1)
	assert(uniquePaths(1, 5) == 1)
	assert(uniquePaths(5, 1) == 1)
	assert(uniquePaths(3, 3) == 6)
	fmt.Println("all tests pass")
}
