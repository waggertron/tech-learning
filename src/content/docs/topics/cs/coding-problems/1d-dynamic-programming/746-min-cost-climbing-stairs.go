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
	// TODO: implement
	return 0
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
