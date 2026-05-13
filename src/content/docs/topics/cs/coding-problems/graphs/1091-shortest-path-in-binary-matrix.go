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

func shortestPathBinaryMatrix(grid [][]int) int {
	// TODO: implement
	return -1
}

func runTests() {
	assert(shortestPathBinaryMatrix([][]int{{0, 1}, {1, 0}}) == 2)
	assert(shortestPathBinaryMatrix([][]int{{0, 0, 0}, {1, 1, 0}, {1, 1, 0}}) == 4)
	assert(shortestPathBinaryMatrix([][]int{{1, 0, 0}, {1, 1, 0}, {1, 1, 0}}) == -1)
	assert(shortestPathBinaryMatrix([][]int{{0, 0, 0}, {0, 0, 0}, {0, 0, 1}}) == -1)
	assert(shortestPathBinaryMatrix([][]int{{0}}) == 1)
	assert(shortestPathBinaryMatrix([][]int{{1}}) == -1)
	assert(shortestPathBinaryMatrix([][]int{{0, 0}, {0, 0}}) == 2)
	fmt.Println("all tests pass")
}

func main() { runTests() }
