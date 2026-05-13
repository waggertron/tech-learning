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
	memo := map[int]int{}
	min := func(a, b int) int {
		if a < b {
			return a
		}
		return b
	}
	var f func(n int) int
	f = func(n int) int {
		if n == 0 {
			return 0
		}
		if n < 0 {
			return amount + 1
		}
		if v, ok := memo[n]; ok {
			return v
		}
		best := amount + 1
		for _, c := range coins {
			best = min(best, 1+f(n-c))
		}
		memo[n] = best
		return best
	}
	result := f(amount)
	if result > amount {
		return -1
	}
	return result
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
