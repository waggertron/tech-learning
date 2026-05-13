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

func searchMatrix(matrix [][]int, target int) bool {
	m, n := len(matrix), len(matrix[0])
	lo, hi := 0, m*n-1
	for lo <= hi {
		mid := (lo + hi) / 2
		r, c := mid/n, mid%n
		if matrix[r][c] == target {
			return true
		}
		if matrix[r][c] < target {
			lo = mid + 1
		} else {
			hi = mid - 1
		}
	}
	return false
}

func runTests() {
	m := [][]int{{1, 3, 5, 7}, {10, 11, 16, 20}, {23, 30, 34, 60}}
	assert(searchMatrix(m, 3) == true)
	assert(searchMatrix(m, 13) == false)
	assert(searchMatrix([][]int{{1}}, 1) == true)
	assert(searchMatrix([][]int{{1}}, 2) == false)
	assert(searchMatrix([][]int{{1, 3}}, 3) == true)
	assert(searchMatrix([][]int{{1}, {3}}, 1) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
