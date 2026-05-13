package main

import "fmt"

func shortestPathBinaryMatrix(grid [][]int) int {
	n := len(grid)
	if grid[0][0] == 1 || grid[n-1][n-1] == 1 {
		return -1
	}
	if n == 1 {
		return 1
	}

	type entry struct{ r, c, dist int }
	queue := []entry{{0, 0, 1}}
	grid[0][0] = 1
	dirs := [][2]int{{-1, -1}, {-1, 0}, {-1, 1}, {0, -1}, {0, 1}, {1, -1}, {1, 0}, {1, 1}}

	for len(queue) > 0 {
		cur := queue[0]
		queue = queue[1:]
		for _, d := range dirs {
			nr, nc := cur.r+d[0], cur.c+d[1]
			if nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] == 0 {
				if nr == n-1 && nc == n-1 {
					return cur.dist + 1
				}
				grid[nr][nc] = 1
				queue = append(queue, entry{nr, nc, cur.dist + 1})
			}
		}
	}
	return -1
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
