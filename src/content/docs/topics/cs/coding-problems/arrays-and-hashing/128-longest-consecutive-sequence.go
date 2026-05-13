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

func longestConsecutive(nums []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(longestConsecutive([]int{100, 4, 200, 1, 3, 2}) == 4, "test 1")
	assert(longestConsecutive([]int{0, 3, 7, 2, 5, 8, 4, 6, 0, 1}) == 9, "test 2")
	assert(longestConsecutive([]int{}) == 0, "test 3")
	assert(longestConsecutive([]int{1}) == 1, "test 4")
	assert(longestConsecutive([]int{1, 2, 3, 4, 5}) == 5, "test 5")
	assert(longestConsecutive([]int{5, 4, 3, 2, 1}) == 5, "test 6")
	fmt.Println("all tests pass")
}

func main() { runTests() }
