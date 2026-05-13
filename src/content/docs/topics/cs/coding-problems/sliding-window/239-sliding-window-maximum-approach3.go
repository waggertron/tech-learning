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
	dq := []int{} // stores indices; front = index of current window max
	result := []int{}
	for i, x := range nums {
		// evict expired front
		for len(dq) > 0 && dq[0] <= i-k {
			dq = dq[1:]
		}
		// remove dominated back entries
		for len(dq) > 0 && nums[dq[len(dq)-1]] < x {
			dq = dq[:len(dq)-1]
		}
		dq = append(dq, i)
		if i >= k-1 {
			result = append(result, nums[dq[0]])
		}
	}
	return result
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
