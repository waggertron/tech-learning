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

func maxAreaOfIsland(grid [][]int) int {
	// TODO: implement
	return 0
}

func runTests() {
	g1 := [][]int{
		{0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0},
		{0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0},
		{0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0},
		{0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0},
		{0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0},
		{0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0},
		{0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0},
		{0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0},
	}
	assert(maxAreaOfIsland(g1) == 6)
	assert(maxAreaOfIsland([][]int{{0, 0, 0, 0, 0, 0, 0, 0}}) == 0)
	assert(maxAreaOfIsland([][]int{{1}}) == 1)
	assert(maxAreaOfIsland([][]int{{0}}) == 0)
	assert(maxAreaOfIsland([][]int{{1, 0, 0, 1, 1}, {1, 0, 0, 0, 1}}) == 3)
	assert(maxAreaOfIsland([][]int{{1, 1}, {1, 1}}) == 4)
	fmt.Println("all tests pass")
}

func main() { runTests() }
