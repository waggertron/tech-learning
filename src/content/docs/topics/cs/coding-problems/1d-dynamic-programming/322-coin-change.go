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

func coinChange(coins []int, amount int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(coinChange([]int{1, 2, 5}, 11) == 3)
	assert(coinChange([]int{2}, 3) == -1)
	assert(coinChange([]int{1}, 0) == 0)
	assert(coinChange([]int{1}, 1) == 1)
	assert(coinChange([]int{2, 5, 10, 1}, 27) == 4)
	assert(coinChange([]int{186, 419, 83, 408}, 6249) == 20)
	fmt.Println("all tests pass")
}

func main() { runTests() }
