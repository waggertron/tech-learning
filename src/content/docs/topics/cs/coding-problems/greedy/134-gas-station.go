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

func canCompleteCircuit(gas []int, cost []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(canCompleteCircuit([]int{1, 2, 3, 4, 5}, []int{3, 4, 5, 1, 2}) == 3)
	assert(canCompleteCircuit([]int{2, 3, 4}, []int{3, 4, 3}) == -1)
	assert(canCompleteCircuit([]int{1}, []int{1}) == 0)
	assert(canCompleteCircuit([]int{5}, []int{4}) == 0)
	assert(canCompleteCircuit([]int{2, 0, 1}, []int{0, 1, 2}) == 0)
	fmt.Println("all tests pass")
}

func main() { runTests() }
