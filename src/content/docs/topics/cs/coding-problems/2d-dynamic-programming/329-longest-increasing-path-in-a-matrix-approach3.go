package main

import "fmt"

func longestIncreasingPath(matrix [][]int) int {
	if len(matrix) == 0 {
		return 0
	}
	rows, cols := len(matrix), len(matrix[0])
	inDeg := make([][]int, rows)
	for i := range inDeg {
		inDeg[i] = make([]int, cols)
	}
	dirs := [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			for _, d := range dirs {
				nr, nc := r+d[0], c+d[1]
				if nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] < matrix[r][c] {
					inDeg[r][c]++
				}
			}
		}
	}
	queue := [][2]int{}
	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			if inDeg[r][c] == 0 {
				queue = append(queue, [2]int{r, c})
			}
		}
	}
	levels := 0
	qi := 0
	for qi < len(queue) {
		levels++
		size := len(queue) - qi
		for s := 0; s < size; s++ {
			r, c := queue[qi][0], queue[qi][1]
			qi++
			for _, d := range dirs {
				nr, nc := r+d[0], c+d[1]
				if nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] > matrix[r][c] {
					inDeg[nr][nc]--
					if inDeg[nr][nc] == 0 {
						queue = append(queue, [2]int{nr, nc})
					}
				}
			}
		}
	}
	return levels
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
