package main

import "fmt"

func maxCoins(nums []int) int {
	padded := make([]int, len(nums)+2)
	padded[0] = 1
	padded[len(padded)-1] = 1
	for i, v := range nums {
		padded[i+1] = v
	}
	n := len(padded)
	dp := make([][]int, n)
	for i := range dp {
		dp[i] = make([]int, n)
	}
	for length := 2; length <= n; length++ {
		for i := 0; i <= n-length; i++ {
			j := i + length - 1
			for k := i + 1; k < j; k++ {
				coins := padded[i]*padded[k]*padded[j] + dp[i][k] + dp[k][j]
				if coins > dp[i][j] {
					dp[i][j] = coins
				}
			}
		}
	}
	return dp[0][n-1]
}

func main() {
	assert := func(cond bool) {
		if !cond {
			panic("assertion failed")
		}
	}
	assert(maxCoins([]int{3, 1, 5, 8}) == 167)
	assert(maxCoins([]int{1, 5}) == 10)
	assert(maxCoins([]int{5}) == 5)
	assert(maxCoins([]int{3, 3}) == 12)
	assert(maxCoins([]int{1, 1, 1}) == 3)
	fmt.Println("all tests pass")
}
