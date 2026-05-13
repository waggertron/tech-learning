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

func containsDuplicate(nums []int) bool {
	seen := make(map[int]struct{})
	for _, n := range nums {
		if _, ok := seen[n]; ok {
			return true
		}
		seen[n] = struct{}{}
	}
	return false
}

func runTests() {
	assert(containsDuplicate([]int{1, 2, 3, 1}) == true)
	assert(containsDuplicate([]int{1, 2, 3, 4}) == false)
	assert(containsDuplicate([]int{1, 1, 1, 3, 3, 4, 3, 2, 4, 2}) == true)
	assert(containsDuplicate([]int{}) == false)
	assert(containsDuplicate([]int{5}) == false)
	assert(containsDuplicate([]int{5, 5}) == true)
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
