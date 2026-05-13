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

func singleNumber(nums []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(singleNumber([]int{2, 2, 1}) == 1)
	assert(singleNumber([]int{4, 1, 2, 1, 2}) == 4)
	assert(singleNumber([]int{1}) == 1)
	assert(singleNumber([]int{0, 0, 99}) == 99)
	assert(singleNumber([]int{-1, -1, 42}) == 42)
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
