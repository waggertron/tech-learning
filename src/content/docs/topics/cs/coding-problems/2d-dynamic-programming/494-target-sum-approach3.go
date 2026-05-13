package main

import "fmt"

func findTargetSumWays(nums []int, target int) int {
	total := 0
	for _, x := range nums {
		total += x
	}
	sum := total + target
	if sum < 0 || sum%2 != 0 {
		return 0
	}
	if total < abs(target) {
		return 0
	}
	P := sum / 2
	dp := make([]int, P+1)
	dp[0] = 1
	for _, x := range nums {
		for s := P; s >= x; s-- {
			dp[s] += dp[s-x]
		}
	}
	return dp[P]
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func main() {
	assert := func(cond bool) {
		if !cond {
			panic("assertion failed")
		}
	}
	assert(findTargetSumWays([]int{1, 1, 1, 1, 1}, 3) == 5)
	assert(findTargetSumWays([]int{1}, 1) == 1)
	assert(findTargetSumWays([]int{1, 1}, 0) == 2)
	assert(findTargetSumWays([]int{1, 2}, 4) == 0)
	assert(findTargetSumWays([]int{1}, -1) == 1)
	assert(findTargetSumWays([]int{0, 0, 0}, 0) == 8)
	fmt.Println("all tests pass")
}
