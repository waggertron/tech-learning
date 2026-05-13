package main

import "fmt"

func updateMatrix(mat [][]int) [][]int {
	rows, cols := len(mat), len(mat[0])
	const INF = 1<<31 - 1
	dist := make([][]int, rows)
	for i := range dist {
		dist[i] = make([]int, cols)
		for j := range dist[i] {
			dist[i][j] = INF
		}
	}
	queue := [][2]int{}
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			if mat[r][c] == 0 {
				dist[r][c] = 0
				queue = append(queue, [2]int{r, c})
			}
		}
	}
	dirs := [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
	for len(queue) > 0 {
		cur := queue[0]
		queue = queue[1:]
		r, c := cur[0], cur[1]
		for _, d := range dirs {
			nr, nc := r+d[0], c+d[1]
			if nr >= 0 && nr < rows && nc >= 0 && nc < cols && dist[nr][nc] == INF {
				dist[nr][nc] = dist[r][c] + 1
				queue = append(queue, [2]int{nr, nc})
			}
		}
	}
	return dist
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

func eqMatrix(a, b [][]int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if len(a[i]) != len(b[i]) {
			return false
		}
		for j := range a[i] {
			if a[i][j] != b[i][j] {
				return false
			}
		}
	}
	return true
}

func runTests() {
	assert(eqMatrix(updateMatrix([][]int{{0, 0, 0}, {0, 1, 0}, {0, 0, 0}}), [][]int{{0, 0, 0}, {0, 1, 0}, {0, 0, 0}}))
	assert(eqMatrix(updateMatrix([][]int{{0, 0, 0}, {0, 1, 0}, {1, 1, 1}}), [][]int{{0, 0, 0}, {0, 1, 0}, {1, 2, 1}}))
	assert(eqMatrix(updateMatrix([][]int{{0, 0}, {0, 0}}), [][]int{{0, 0}, {0, 0}}))
	assert(eqMatrix(updateMatrix([][]int{{0}}), [][]int{{0}}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
