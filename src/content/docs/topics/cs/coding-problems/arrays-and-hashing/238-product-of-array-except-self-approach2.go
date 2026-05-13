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

func productExceptSelf(nums []int) []int {
	n := len(nums)
	prefix := make([]int, n)
	suffix := make([]int, n)
	prefix[0] = 1
	for i := 1; i < n; i++ {
		prefix[i] = prefix[i-1] * nums[i-1]
	}
	suffix[n-1] = 1
	for i := n - 2; i >= 0; i-- {
		suffix[i] = suffix[i+1] * nums[i+1]
	}
	result := make([]int, n)
	for i := 0; i < n; i++ {
		result[i] = prefix[i] * suffix[i]
	}
	return result
}

func intsEqual(a, b []int) bool {
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
	assert(intsEqual(productExceptSelf([]int{1, 2, 3, 4}), []int{24, 12, 8, 6}), "test 1")
	assert(intsEqual(productExceptSelf([]int{-1, 1, 0, -3, 3}), []int{0, 0, 9, 0, 0}), "test 2")
	assert(intsEqual(productExceptSelf([]int{1, 1}), []int{1, 1}), "test 3")
	assert(intsEqual(productExceptSelf([]int{2, 3}), []int{3, 2}), "test 4")
	assert(intsEqual(productExceptSelf([]int{1, 0}), []int{0, 1}), "test 5")
	fmt.Println("all tests pass")
}

func main() { runTests() }
