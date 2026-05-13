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
	memo := make([]int, n)
	for i := range memo {
		memo[i] = -1
	}
	max := func(a, b int) int {
		if a > b {
			return a
		}
		return b
	}
	var f func(i int) int
	f = func(i int) int {
		if i >= n {
			return 0
		}
		if memo[i] != -1 {
			return memo[i]
		}
		result := max(nums[i]+f(i+2), f(i+1))
		memo[i] = result
		return result
	}
	return f(0)
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
