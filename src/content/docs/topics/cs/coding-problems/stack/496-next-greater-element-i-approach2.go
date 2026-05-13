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

func nextGreaterElement(nums1 []int, nums2 []int) []int {
	nge := map[int]int{}
	stack := []int{}

	for _, num := range nums2 {
		for len(stack) > 0 && stack[len(stack)-1] < num {
			nge[stack[len(stack)-1]] = num
			stack = stack[:len(stack)-1]
		}
		stack = append(stack, num)
	}
	for _, num := range stack {
		nge[num] = -1
	}

	result := make([]int, len(nums1))
	for i, x := range nums1 {
		result[i] = nge[x]
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
	assert(sliceEq(nextGreaterElement([]int{4, 1, 2}, []int{1, 3, 4, 2}), []int{-1, 3, -1}))
	assert(sliceEq(nextGreaterElement([]int{2, 4}, []int{1, 2, 3, 4}), []int{3, -1}))
	assert(sliceEq(nextGreaterElement([]int{1}, []int{1}), []int{-1}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
