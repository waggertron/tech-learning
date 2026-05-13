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

func canPartition(nums []int) bool {
	// TODO: implement
	return false
}

func runTests() {
	assert(canPartition([]int{1, 5, 11, 5}) == true)
	assert(canPartition([]int{1, 2, 3, 5}) == false)
	assert(canPartition([]int{1}) == false)
	assert(canPartition([]int{2, 2}) == true)
	assert(canPartition([]int{1, 2, 5}) == false)
	assert(canPartition([]int{3, 3, 3, 4, 5}) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
