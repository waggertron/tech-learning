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

func maxProfit(prices []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(maxProfit([]int{1, 2, 3, 0, 2}) == 3)
	assert(maxProfit([]int{1}) == 0)
	assert(maxProfit([]int{}) == 0)
	assert(maxProfit([]int{5, 4, 3, 2, 1}) == 0)
	assert(maxProfit([]int{1, 2, 3, 4, 5}) == 4)
	assert(maxProfit([]int{1, 2}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
