package main

import (
	"fmt"
	"reflect"
)

func setZeroes(matrix [][]int) {
	rows, cols := len(matrix), len(matrix[0])    // L1: O(1)
	zeroRows := make([]bool, rows)               // L2: O(m)
	zeroCols := make([]bool, cols)               // L3: O(n)

	for r := 0; r < rows; r++ {                 // L4: first pass, m*n iterations
		for c := 0; c < cols; c++ {
			if matrix[r][c] == 0 {
				zeroRows[r] = true               // L5: O(1)
				zeroCols[c] = true               // L6: O(1)
			}
		}
	}

	for r := 0; r < rows; r++ {                 // L7: second pass, m*n iterations
		for c := 0; c < cols; c++ {
			if zeroRows[r] || zeroCols[c] {
				matrix[r][c] = 0                 // L8: O(1)
			}
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
	m := [][]int{{1, 1, 1}, {1, 0, 1}, {1, 1, 1}}
	setZeroes(m)
	assert(reflect.DeepEqual(m, [][]int{{1, 0, 1}, {0, 0, 0}, {1, 0, 1}}))
	m2 := [][]int{{0, 1, 2, 0}, {3, 4, 5, 2}, {1, 3, 1, 5}}
	setZeroes(m2)
	assert(reflect.DeepEqual(m2, [][]int{{0, 0, 0, 0}, {0, 4, 5, 0}, {0, 3, 1, 0}}))
	m3 := [][]int{{1}}
	setZeroes(m3)
	assert(reflect.DeepEqual(m3, [][]int{{1}}))
	m4 := [][]int{{0}}
	setZeroes(m4)
	assert(reflect.DeepEqual(m4, [][]int{{0}}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
