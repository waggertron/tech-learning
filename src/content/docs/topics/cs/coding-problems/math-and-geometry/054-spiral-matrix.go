package main

import (
	"fmt"
	"reflect"
)

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func spiralOrder(matrix [][]int) []int {
	// TODO: implement
	return nil
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
