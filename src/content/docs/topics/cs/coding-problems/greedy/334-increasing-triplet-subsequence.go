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

func increasingTriplet(nums []int) bool {
	// TODO: implement
	return false
}

func runTests() {
	assert(increasingTriplet([]int{1, 2, 3, 4, 5}) == true)
	assert(increasingTriplet([]int{5, 4, 3, 2, 1}) == false)
	assert(increasingTriplet([]int{2, 1, 5, 0, 4, 6}) == true)
	assert(increasingTriplet([]int{1, 2}) == false)
	assert(increasingTriplet([]int{1, 1, 1, 1, 1}) == false)
	assert(increasingTriplet([]int{20, 100, 10, 12, 5, 13}) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
