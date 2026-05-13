package main

import (
	"fmt"
	"sort"
)

func pacificAtlantic(heights [][]int) [][]int {
	if len(heights) == 0 {
		return nil
	}
	rows, cols := len(heights), len(heights[0])
	pac := make([][]bool, rows)
	atl := make([][]bool, rows)
	for i := range pac {
		pac[i] = make([]bool, cols)
		atl[i] = make([]bool, cols)
	}
	dirs := [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}

	var dfs func(r, c int, visited [][]bool)
	dfs = func(r, c int, visited [][]bool) {
		if visited[r][c] {
			return
		}
		visited[r][c] = true
		for _, d := range dirs {
			nr, nc := r+d[0], c+d[1]
			if nr >= 0 && nr < rows && nc >= 0 && nc < cols && heights[nr][nc] >= heights[r][c] {
				dfs(nr, nc, visited)
			}
		}
	}

	for c := 0; c < cols; c++ {
		dfs(0, c, pac)
		dfs(rows-1, c, atl)
	}
	for r := 0; r < rows; r++ {
		dfs(r, 0, pac)
		dfs(r, cols-1, atl)
	}

	var result [][]int
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			if pac[r][c] && atl[r][c] {
				result = append(result, []int{r, c})
			}
		}
	}
	sort.Slice(result, func(i, j int) bool {
		if result[i][0] != result[j][0] {
			return result[i][0] < result[j][0]
		}
		return result[i][1] < result[j][1]
	})
	return result
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

func eqResult(a, b [][]int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i][0] != b[i][0] || a[i][1] != b[i][1] {
			return false
		}
	}
	return true
}

func runTests() {
	h1 := [][]int{{1, 2, 2, 3, 5}, {3, 2, 3, 4, 4}, {2, 4, 5, 3, 1}, {6, 7, 1, 4, 5}, {5, 1, 1, 2, 4}}
	expected1 := [][]int{{0, 4}, {1, 3}, {1, 4}, {2, 2}, {3, 0}, {3, 1}, {4, 0}}
	assert(eqResult(pacificAtlantic(h1), expected1))
	assert(eqResult(pacificAtlantic([][]int{{5}}), [][]int{{0, 0}}))
	h2 := [][]int{{1, 1}, {1, 1}}
	assert(eqResult(pacificAtlantic(h2), [][]int{{0, 0}, {0, 1}, {1, 0}, {1, 1}}))
	assert(len(pacificAtlantic([][]int{})) == 0)
	fmt.Println("all tests pass")
}

func main() { runTests() }
