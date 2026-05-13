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
	// TODO: implement
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
