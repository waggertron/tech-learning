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
	assert(canCompleteCircuit([]int{0}, []int{0}) == 0)
	assert(canCompleteCircuit([]int{10_000}, []int{10_000}) == 0)
	assert(canCompleteCircuit([]int{2, 0, 1}, []int{0, 1, 2}) == 0)

	n := 100_000
	largeGas := make([]int, n)
	largeCost := make([]int, n)
	for i := 0; i < 10_000; i++ {
		largeCost[i] = 1
	}
	largeGas[10_000] = 10_000
	assert(canCompleteCircuit(largeGas, largeCost) == 10_000)
	fmt.Println("all tests pass")
}

func main() { runTests() }
