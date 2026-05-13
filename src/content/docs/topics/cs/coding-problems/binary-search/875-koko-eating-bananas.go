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

func minEatingSpeed(piles []int, h int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(minEatingSpeed([]int{3, 6, 7, 11}, 8) == 4)
	assert(minEatingSpeed([]int{30, 11, 23, 4, 20}, 5) == 30)
	assert(minEatingSpeed([]int{30, 11, 23, 4, 20}, 6) == 23)
	assert(minEatingSpeed([]int{1}, 1) == 1)
	assert(minEatingSpeed([]int{1000000000}, 2) == 500000000)
	fmt.Println("all tests pass")
}

func main() { runTests() }
