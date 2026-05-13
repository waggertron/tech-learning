package main

import "fmt"

func longestIncreasingPath(matrix [][]int) int {
	if len(matrix) == 0 {
		return 0
	}
	max := func(a, b int) int {
		if a > b {
			return a
		}
		return b
	}
	rows, cols := len(matrix), len(matrix[0])
	memo := make([][]int, rows)
	for i := range memo {
		memo[i] = make([]int, cols)
	}
	dirs := [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
	var dfs func(r, c int) int
	dfs = func(r, c int) int {
		if memo[r][c] != 0 {
			return memo[r][c]
		}
		best := 1
		for _, d := range dirs {
			nr, nc := r+d[0], c+d[1]
			if nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] > matrix[r][c] {
				best = max(best, 1+dfs(nr, nc))
			}
		}
		memo[r][c] = best
		return best
	}
	ans := 0
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			ans = max(ans, dfs(r, c))
		}
	}
	return ans
}

func main() {
	assert := func(cond bool) {
		if !cond {
			panic("assertion failed")
		}
	}
	assert(longestIncreasingPath([][]int{{9, 9, 4}, {6, 6, 8}, {2, 1, 1}}) == 4)
	assert(longestIncreasingPath([][]int{{3, 4, 5}, {3, 2, 6}, {2, 2, 1}}) == 4)
	assert(longestIncreasingPath([][]int{{1}}) == 1)
	assert(longestIncreasingPath([][]int{{1, 1}, {1, 1}}) == 1)
	assert(longestIncreasingPath([][]int{{1, 2, 3, 4}}) == 4)
	fmt.Println("all tests pass")
}
