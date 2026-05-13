package main

import (
	"fmt"
	"reflect"
)

func setZeroes(matrix [][]int) {
	rows, cols := len(matrix), len(matrix[0])
	firstRowZero := false
	for c := 0; c < cols; c++ {                    // L1: O(n)
		if matrix[0][c] == 0 {
			firstRowZero = true
			break
		}
	}
	firstColZero := false
	for r := 0; r < rows; r++ {                    // L2: O(m)
		if matrix[r][0] == 0 {
			firstColZero = true
			break
		}
	}

	// Use first row/col as markers
	for r := 1; r < rows; r++ {                    // L3: mark pass (m-1)*(n-1)
		for c := 1; c < cols; c++ {
			if matrix[r][c] == 0 {
				matrix[r][0] = 0                   // L4: O(1)
				matrix[0][c] = 0                   // L5: O(1)
			}
		}
	}

	// Zero based on markers
	for r := 1; r < rows; r++ {                    // L6: apply pass (m-1)*(n-1)
		for c := 1; c < cols; c++ {
			if matrix[r][0] == 0 || matrix[0][c] == 0 {
				matrix[r][c] = 0                   // L7: O(1)
			}
		}
	}

	if firstRowZero {
		for c := 0; c < cols; c++ {
			matrix[0][c] = 0                       // L8: O(n)
		}
	}
	if firstColZero {
		for r := 0; r < rows; r++ {
			matrix[r][0] = 0                       // L9: O(m)
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
