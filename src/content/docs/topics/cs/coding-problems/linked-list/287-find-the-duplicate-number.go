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

func findDuplicate(nums []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(findDuplicate([]int{1, 3, 4, 2, 2}) == 2)
	assert(findDuplicate([]int{3, 1, 3, 4, 2}) == 3)
	assert(findDuplicate([]int{3, 3, 3, 3, 3}) == 3)
	assert(findDuplicate([]int{1, 1}) == 1)
	assert(findDuplicate([]int{2, 2, 2, 1}) == 2)
	fmt.Println("all tests pass")
}

func main() { runTests() }
