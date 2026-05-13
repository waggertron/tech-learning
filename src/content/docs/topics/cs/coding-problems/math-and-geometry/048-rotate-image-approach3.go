package main

import (
	"fmt"
	"reflect"
)

func rotate(matrix [][]int) {
	n := len(matrix)
	// Transpose
	for i := 0; i < n; i++ {                              // L1: outer loop, n iterations
		for j := i + 1; j < n; j++ {                      // L2: upper-triangle only
			matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]  // L3: O(1) swap
		}
	}
	// Reverse each row
	for _, row := range matrix {                           // L4: n rows
		for lo, hi := 0, len(row)-1; lo < hi; lo, hi = lo+1, hi-1 {
			row[lo], row[hi] = row[hi], row[lo]            // L5: O(n) per row
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
