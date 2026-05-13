package main

import "fmt"

func maxAreaOfIsland(grid [][]int) int {
	if len(grid) == 0 {
		return 0
	}
	rows, cols := len(grid), len(grid[0])

	var dfs func(r, c int) int
	dfs = func(r, c int) int {
		if r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != 1 {
			return 0
		}
		grid[r][c] = 0
		return 1 + dfs(r+1, c) + dfs(r-1, c) + dfs(r, c+1) + dfs(r, c-1)
	}

	best := 0
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			if grid[r][c] == 1 {
				if area := dfs(r, c); area > best {
					best = area
				}
			}
		}
	}
	return best
}

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
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
