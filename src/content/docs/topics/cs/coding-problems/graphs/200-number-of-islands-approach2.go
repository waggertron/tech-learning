package main

import "fmt"

func numIslands(grid [][]byte) int {
	if len(grid) == 0 {
		return 0
	}
	rows, cols := len(grid), len(grid[0])
	count := 0
	dirs := [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}

	bfs := func(r, c int) {
		queue := [][2]int{{r, c}}
		grid[r][c] = '0'
		for len(queue) > 0 {
			cur := queue[0]
			queue = queue[1:]
			for _, d := range dirs {
				nr, nc := cur[0]+d[0], cur[1]+d[1]
				if nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == '1' {
					grid[nr][nc] = '0'
					queue = append(queue, [2]int{nr, nc})
				}
			}
		}
	}

	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			if grid[r][c] == '1' {
				count++
				bfs(r, c)
			}
		}
	}
	return count
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
	g1 := [][]byte{
		{'1', '1', '1', '1', '0'},
		{'1', '1', '0', '1', '0'},
		{'1', '1', '0', '0', '0'},
		{'0', '0', '0', '0', '0'},
	}
	assert(numIslands(g1) == 1)
	g2 := [][]byte{
		{'1', '1', '0', '0', '0'},
		{'1', '1', '0', '0', '0'},
		{'0', '0', '1', '0', '0'},
		{'0', '0', '0', '1', '1'},
	}
	assert(numIslands(g2) == 3)
	assert(numIslands([][]byte{}) == 0)
	assert(numIslands([][]byte{{'1'}}) == 1)
	assert(numIslands([][]byte{{'0'}}) == 0)
	assert(numIslands([][]byte{{'1', '1'}, {'1', '1'}}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
