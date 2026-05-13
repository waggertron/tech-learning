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

func canJump(nums []int) bool {
	// TODO: implement
	return false
}

func runTests() {
	assert(canJump([]int{2, 3, 1, 1, 4}) == true)
	assert(canJump([]int{3, 2, 1, 0, 4}) == false)
	assert(canJump([]int{0}) == true)
	assert(canJump([]int{1, 0}) == true)
	assert(canJump([]int{0, 1}) == false)
	assert(canJump([]int{2, 0, 0}) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
