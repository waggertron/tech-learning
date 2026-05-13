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
	max := func(a, b int) int {
		if a > b {
			return a
		}
		return b
	}
	robRange := func(lo, hi int) int {
		prev2, prev1 := 0, 0
		for i := lo; i < hi; i++ {
			prev2, prev1 = prev1, max(prev1, prev2+nums[i])
		}
		return prev1
	}
	if len(nums) == 1 {
		return nums[0]
	}
	return max(robRange(0, len(nums)-1), robRange(1, len(nums)))
}

func runTests() {
	assert(rob([]int{2, 3, 2}) == 3)
	assert(rob([]int{1, 2, 3, 1}) == 4)
	assert(rob([]int{1, 2, 3}) == 3)
	assert(rob([]int{5}) == 5)
	assert(rob([]int{1, 3}) == 3)
	assert(rob([]int{2, 7, 9, 3, 1}) == 11)
	fmt.Println("all tests pass")
}

func main() { runTests() }
