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

func nextGreaterElements(nums []int) []int {
	n := len(nums)
	result := make([]int, n)
	for i := range result {
		result[i] = -1
	}
	stack := []int{}

	for i := 0; i < 2*n; i++ {
		for len(stack) > 0 && nums[stack[len(stack)-1]] < nums[i%n] {
			result[stack[len(stack)-1]] = nums[i%n]
			stack = stack[:len(stack)-1]
		}
		if i < n {
			stack = append(stack, i)
		}
	}
	return result
}

func sliceEq(a, b []int) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

func runTests() {
	assert(sliceEq(nextGreaterElements([]int{1, 2, 1}), []int{2, -1, 2}))
	assert(sliceEq(nextGreaterElements([]int{1, 2, 3, 4, 3}), []int{2, 3, 4, -1, 4}))
	assert(sliceEq(nextGreaterElements([]int{5, 4, 3, 2, 1}), []int{-1, 5, 5, 5, 5}))
	assert(sliceEq(nextGreaterElements([]int{1}), []int{-1}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
