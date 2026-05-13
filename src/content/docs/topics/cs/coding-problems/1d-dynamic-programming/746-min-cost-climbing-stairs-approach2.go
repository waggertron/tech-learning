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

func minCostClimbingStairs(cost []int) int {
	n := len(cost)
	memo := make([]int, n)
	for i := range memo {
		memo[i] = -1
	}
	min := func(a, b int) int {
		if a < b {
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
		result := cost[i] + min(f(i+1), f(i+2))
		memo[i] = result
		return result
	}
	return min(f(0), f(1))
}

func runTests() {
	assert(minCostClimbingStairs([]int{10, 15, 20}) == 15)
	assert(minCostClimbingStairs([]int{1, 100, 1, 1, 1, 100, 1, 1, 100, 1}) == 6)
	assert(minCostClimbingStairs([]int{0, 0}) == 0)
	assert(minCostClimbingStairs([]int{1, 2}) == 1)
	assert(minCostClimbingStairs([]int{5, 3, 1, 2}) == 4)
	fmt.Println("all tests pass")
}

func main() { runTests() }
