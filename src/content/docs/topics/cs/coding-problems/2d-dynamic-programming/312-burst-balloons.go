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

func maxCoins(nums []int) int {
	// TODO: implement
	return 0
}

func runTests() {
	assert(maxCoins([]int{3, 1, 5, 8}) == 167)
	assert(maxCoins([]int{1, 5}) == 10)
	assert(maxCoins([]int{5}) == 5)
	assert(maxCoins([]int{3, 3}) == 12)
	assert(maxCoins([]int{1, 1, 1}) == 3)
	fmt.Println("all tests pass")
}

func main() { runTests() }
