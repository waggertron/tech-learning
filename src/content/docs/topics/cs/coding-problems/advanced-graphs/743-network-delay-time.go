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

func networkDelayTime(times [][]int, n int, k int) int {
	// TODO: implement
	return -1
}

func runTests() {
	assert(networkDelayTime([][]int{{2, 1, 1}, {2, 3, 1}, {3, 4, 1}}, 4, 2) == 2)
	assert(networkDelayTime([][]int{{1, 2, 1}}, 2, 1) == 1)
	assert(networkDelayTime([][]int{{1, 2, 1}}, 2, 2) == -1)
	assert(networkDelayTime([][]int{}, 1, 1) == 0)
	assert(networkDelayTime([][]int{{1, 2, 1}, {1, 2, 5}}, 2, 1) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
