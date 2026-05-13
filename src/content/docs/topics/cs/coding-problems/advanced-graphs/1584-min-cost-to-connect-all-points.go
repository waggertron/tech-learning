package main

import (
	"fmt"
)

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func minCostConnectPoints(points [][]int) int {
	// TODO: implement
	return -1
}

func runTests() {
	assert(minCostConnectPoints([][]int{{0, 0}, {2, 2}, {3, 10}, {5, 2}, {7, 0}}) == 20)
	assert(minCostConnectPoints([][]int{{3, 12}, {-2, 5}, {-4, 1}}) == 18)
	assert(minCostConnectPoints([][]int{{0, 0}}) == 0)
	assert(minCostConnectPoints([][]int{{0, 0}, {1, 1}}) == 2)
	assert(minCostConnectPoints([][]int{{0, 0}, {1, 0}, {2, 0}, {3, 0}}) == 3)
	fmt.Println("all tests pass")
}

func main() { runTests() }
