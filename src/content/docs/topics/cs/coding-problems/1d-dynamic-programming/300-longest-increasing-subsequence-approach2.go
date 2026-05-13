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

func lengthOfLIS(nums []int) int {
	n := len(nums)
	dp := make([]int, n)
	for i := range dp {
		dp[i] = 1
	}
	max := func(a, b int) int {
		if a > b {
			return a
		}
		return b
	}
	for i := 1; i < n; i++ {
		for j := 0; j < i; j++ {
			if nums[j] < nums[i] {
				dp[i] = max(dp[i], dp[j]+1)
			}
		}
	}
	best := 0
	for _, v := range dp {
		if v > best {
			best = v
		}
	}
	return best
}

func runTests() {
	assert(lengthOfLIS([]int{10, 9, 2, 5, 3, 7, 101, 18}) == 4)
	assert(lengthOfLIS([]int{0, 1, 0, 3, 2, 3}) == 4)
	assert(lengthOfLIS([]int{7, 7, 7, 7}) == 1)
	assert(lengthOfLIS([]int{1}) == 1)
	assert(lengthOfLIS([]int{1, 2, 3, 4, 5}) == 5)
	assert(lengthOfLIS([]int{5, 4, 3, 2, 1}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
