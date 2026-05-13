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

func numPairsDivisibleBy60(time []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(numPairsDivisibleBy60([]int{30, 20, 150, 100, 40}) == 3, "test 1")
	assert(numPairsDivisibleBy60([]int{60, 60, 60}) == 3, "test 2")
	assert(numPairsDivisibleBy60([]int{10, 50, 90, 30}) == 2, "test 3")
	assert(numPairsDivisibleBy60([]int{1}) == 0, "test 4")
	fmt.Println("all tests pass")
}

func main() { runTests() }
