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

func jump(nums []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(jump([]int{2, 3, 1, 1, 4}) == 2)
	assert(jump([]int{2, 3, 0, 1, 4}) == 2)
	assert(jump([]int{1}) == 0)
	assert(jump([]int{1, 1, 1, 1}) == 3)
	assert(jump([]int{5, 4, 3, 2, 1, 0}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
