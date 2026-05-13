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

func eraseOverlapIntervals(intervals [][]int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(eraseOverlapIntervals([][]int{{1, 2}, {2, 3}, {3, 4}, {1, 3}}) == 1)
	assert(eraseOverlapIntervals([][]int{{1, 2}, {1, 2}, {1, 2}}) == 2)
	assert(eraseOverlapIntervals([][]int{{1, 2}, {2, 3}}) == 0)
	assert(eraseOverlapIntervals([][]int{{1, 5}}) == 0)
	assert(eraseOverlapIntervals([][]int{}) == 0)
	assert(eraseOverlapIntervals([][]int{{1, 100}, {2, 3}, {4, 5}, {6, 7}}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
