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
	assert(maxProfit([]int{7, 1, 5, 3, 6, 4}) == 5)
	assert(maxProfit([]int{7, 6, 4, 3, 1}) == 0)
	assert(maxProfit([]int{1}) == 0)
	assert(maxProfit([]int{1, 2}) == 1)
	assert(maxProfit([]int{2, 4, 1}) == 2)
	assert(maxProfit([]int{3, 3, 3}) == 0)
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
