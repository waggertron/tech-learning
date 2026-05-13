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

func rob(nums []int) int {
	n := len(nums)
	if n == 1 {
		return nums[0]
	}
	max := func(a, b int) int {
		if a > b {
			return a
		}
		return b
	}
	dp := make([]int, n)
	dp[0] = nums[0]
	dp[1] = max(nums[0], nums[1])
	for i := 2; i < n; i++ {
		dp[i] = max(dp[i-1], dp[i-2]+nums[i])
	}
	return dp[n-1]
}

func runTests() {
	assert(rob([]int{1, 2, 3, 1}) == 4)
	assert(rob([]int{2, 7, 9, 3, 1}) == 12)
	assert(rob([]int{0}) == 0)
	assert(rob([]int{5}) == 5)
	assert(rob([]int{2, 1}) == 2)
	assert(rob([]int{1, 3, 1, 3, 100}) == 103)
	fmt.Println("all tests pass")
}

func main() { runTests() }
