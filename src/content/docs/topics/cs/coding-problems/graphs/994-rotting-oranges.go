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

func orangesRotting(grid [][]int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(orangesRotting([][]int{{2, 1, 1}, {1, 1, 0}, {0, 1, 1}}) == 4)
	assert(orangesRotting([][]int{{2, 1, 1}, {0, 1, 1}, {1, 0, 1}}) == -1)
	assert(orangesRotting([][]int{{0, 2}}) == 0)
	assert(orangesRotting([][]int{{1, 1}, {1, 1}}) == -1)
	assert(orangesRotting([][]int{{0}}) == 0)
	assert(orangesRotting([][]int{{2, 1}}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
