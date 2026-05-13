package main

import (
	"fmt"
	"reflect"
)

func spiralOrder(matrix [][]int) []int {
	if len(matrix) == 0 {
		return []int{}
	}
	result := []int{}
	top, bottom := 0, len(matrix)-1              // L1: O(1)
	left, right := 0, len(matrix[0])-1           // L2: O(1)

	for top <= bottom && left <= right {          // L3: outer loop, min(m,n)/2 rounds
		for c := left; c <= right; c++ {          // L4: walk top row
			result = append(result, matrix[top][c])  // L5: O(1) amortized
		}
		top++                                     // L6: shrink
		for r := top; r <= bottom; r++ {          // L7: walk right col
			result = append(result, matrix[r][right])
		}
		right--
		if top <= bottom {
			for c := right; c >= left; c-- {      // L8: walk bottom row
				result = append(result, matrix[bottom][c])
			}
			bottom--
		}
		if left <= right {
			for r := bottom; r >= top; r-- {      // L9: walk left col
				result = append(result, matrix[r][left])
			}
			left++
		}
	}
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

func runTests() {
	assert(reflect.DeepEqual(spiralOrder([][]int{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}), []int{1, 2, 3, 6, 9, 8, 7, 4, 5}))
	assert(reflect.DeepEqual(spiralOrder([][]int{{1, 2, 3, 4}, {5, 6, 7, 8}, {9, 10, 11, 12}}), []int{1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7}))
	assert(reflect.DeepEqual(spiralOrder([][]int{{1}}), []int{1}))
	assert(reflect.DeepEqual(spiralOrder([][]int{{1, 2}, {3, 4}}), []int{1, 2, 4, 3}))
	assert(reflect.DeepEqual(spiralOrder([][]int{{1}, {2}, {3}}), []int{1, 2, 3}))
	assert(reflect.DeepEqual(spiralOrder([][]int{{1, 2, 3}}), []int{1, 2, 3}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
