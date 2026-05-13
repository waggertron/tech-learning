package main

import "fmt"

func canCompleteCircuit(gas []int, cost []int) int {
	totalGas := 0
	totalCost := 0
	for _, g := range gas {
		totalGas += g
	}
	for _, c := range cost {
		totalCost += c
	}
	if totalGas < totalCost {
		return -1
	}
	tank := 0
	start := 0
	for i := range gas {
		tank += gas[i] - cost[i]
		if tank < 0 {
			start = i + 1
			tank = 0
		}
	}
	return start
}

func main() {
	assert := func(condition bool) {
		if !condition {
			panic("assertion failed")
		}
	}
	assert(canCompleteCircuit([]int{1, 2, 3, 4, 5}, []int{3, 4, 5, 1, 2}) == 3)
	assert(canCompleteCircuit([]int{2, 3, 4}, []int{3, 4, 3}) == -1)
	assert(canCompleteCircuit([]int{1}, []int{1}) == 0)
	assert(canCompleteCircuit([]int{5}, []int{4}) == 0)
	assert(canCompleteCircuit([]int{2, 0, 1}, []int{0, 1, 2}) == 0)
	fmt.Println("all tests pass")
}
