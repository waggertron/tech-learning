package main

import "fmt"

type cell struct{ r, c, t int }

func orangesRotting(grid [][]int) int {
	rows, cols := len(grid), len(grid[0])
	queue := []cell{}
	fresh := 0
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			if grid[r][c] == 2 {
				queue = append(queue, cell{r, c, 0})
			} else if grid[r][c] == 1 {
				fresh++
			}
		}
	}

	dirs := [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
	time := 0
	for len(queue) > 0 {
		cur := queue[0]
		queue = queue[1:]
		time = cur.t
		for _, d := range dirs {
			nr, nc := cur.r+d[0], cur.c+d[1]
			if nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1 {
				grid[nr][nc] = 2
				fresh--
				queue = append(queue, cell{nr, nc, cur.t + 1})
			}
		}
	}

	if fresh == 0 {
		return time
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
	assert(orangesRotting([][]int{{2, 1, 1}, {1, 1, 0}, {0, 1, 1}}) == 4)
	assert(orangesRotting([][]int{{2, 1, 1}, {0, 1, 1}, {1, 0, 1}}) == -1)
	assert(orangesRotting([][]int{{0, 2}}) == 0)
	assert(orangesRotting([][]int{{1, 1}, {1, 1}}) == -1)
	assert(orangesRotting([][]int{{0}}) == 0)
	assert(orangesRotting([][]int{{2, 1}}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
