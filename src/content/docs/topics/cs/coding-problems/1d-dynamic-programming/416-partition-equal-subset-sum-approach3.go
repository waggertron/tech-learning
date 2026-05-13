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

func canPartition(nums []int) bool {
	total := 0
	for _, x := range nums {
		total += x
	}
	if total%2 != 0 {
		return false
	}
	target := total / 2
	dp := make([]bool, target+1)
	dp[0] = true
	for _, x := range nums {
		for s := target; s >= x; s-- {
			dp[s] = dp[s] || dp[s-x]
		}
	}
	return dp[target]
}

func runTests() {
	assert(canPartition([]int{1, 5, 11, 5}) == true)
	assert(canPartition([]int{1, 2, 3, 5}) == false)
	assert(canPartition([]int{1}) == false)
	assert(canPartition([]int{2, 2}) == true)
	assert(canPartition([]int{1, 2, 5}) == false)
	assert(canPartition([]int{3, 3, 3, 4, 5}) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
