package main

import (
	"fmt"
	"reflect"
)

func rotate(matrix [][]int) {
	n := len(matrix)                                   // L1: O(1)
	for r := 0; r < n/2; r++ {                        // L2: n/2 rings
		for c := r; c < n-r-1; c++ {                  // L3: n-2r-1 cells per ring
			tmp := matrix[r][c]                        // L4: save top-left
			matrix[r][c] = matrix[n-1-c][r]           // L5: left -> top
			matrix[n-1-c][r] = matrix[n-1-r][n-1-c]  // L6: bottom -> left
			matrix[n-1-r][n-1-c] = matrix[c][n-1-r]  // L7: right -> bottom
			matrix[c][n-1-r] = tmp                    // L8: top -> right
		}
	}
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
	m := [][]int{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}
	rotate(m)
	assert(reflect.DeepEqual(m, [][]int{{7, 4, 1}, {8, 5, 2}, {9, 6, 3}}))
	m2 := [][]int{{5, 1, 9, 11}, {2, 4, 8, 10}, {13, 3, 6, 7}, {15, 14, 12, 16}}
	rotate(m2)
	assert(reflect.DeepEqual(m2, [][]int{{15, 13, 2, 5}, {14, 3, 4, 1}, {12, 6, 8, 9}, {16, 7, 10, 11}}))
	m3 := [][]int{{1}}
	rotate(m3)
	assert(reflect.DeepEqual(m3, [][]int{{1}}))
	m4 := [][]int{{1, 2}, {3, 4}}
	rotate(m4)
	assert(reflect.DeepEqual(m4, [][]int{{3, 1}, {4, 2}}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
