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

func maxSlidingWindow(nums []int, k int) []int {
	// TODO: implement
	return nil
}

func runTests() {
	assert(reflect.DeepEqual(maxSlidingWindow([]int{1, 3, -1, -3, 5, 3, 6, 7}, 3), []int{3, 3, 5, 5, 6, 7}))
	assert(reflect.DeepEqual(maxSlidingWindow([]int{1}, 1), []int{1}))
	assert(reflect.DeepEqual(maxSlidingWindow([]int{1, -1}, 1), []int{1, -1}))
	assert(reflect.DeepEqual(maxSlidingWindow([]int{9, 8, 7, 6, 5}, 3), []int{9, 8, 7}))
	assert(reflect.DeepEqual(maxSlidingWindow([]int{1, 2, 3, 4, 5}, 3), []int{3, 4, 5}))
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
