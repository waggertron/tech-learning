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
	// TODO: implement
	return nil
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
