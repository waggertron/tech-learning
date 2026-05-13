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

func search(nums []int, target int) int {
	// TODO: implement
	return -1
}

func runTests() {
	assert(search([]int{-1, 0, 3, 5, 9, 12}, 9) == 4)
	assert(search([]int{-1, 0, 3, 5, 9, 12}, 2) == -1)
	assert(search([]int{5}, 5) == 0)
	assert(search([]int{5}, 3) == -1)
	assert(search([]int{-1, 0, 3, 5, 9, 12}, -1) == 0)
	assert(search([]int{-1, 0, 3, 5, 9, 12}, 12) == 5)
	fmt.Println("all tests pass")
}

func main() { runTests() }
