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

func isNStraightHand(hand []int, groupSize int) bool {
	// TODO: implement
	return false
}

func runTests() {
	assert(isNStraightHand([]int{1, 2, 3, 6, 2, 3, 4, 7, 8}, 3) == true)
	assert(isNStraightHand([]int{1, 2, 3, 4, 5}, 4) == false)
	assert(isNStraightHand([]int{1}, 1) == true)
	assert(isNStraightHand([]int{1, 2, 3}, 3) == true)
	assert(isNStraightHand([]int{1, 2, 4}, 3) == false)
	assert(isNStraightHand([]int{1, 1, 2, 2, 3, 3}, 3) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
