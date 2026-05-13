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

func longestIncreasingPath(matrix [][]int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(longestIncreasingPath([][]int{{9, 9, 4}, {6, 6, 8}, {2, 1, 1}}) == 4)
	assert(longestIncreasingPath([][]int{{3, 4, 5}, {3, 2, 6}, {2, 2, 1}}) == 4)
	assert(longestIncreasingPath([][]int{{1}}) == 1)
	assert(longestIncreasingPath([][]int{{1, 1}, {1, 1}}) == 1)
	assert(longestIncreasingPath([][]int{{1, 2, 3, 4}}) == 4)
	fmt.Println("all tests pass")
}

func main() { runTests() }
