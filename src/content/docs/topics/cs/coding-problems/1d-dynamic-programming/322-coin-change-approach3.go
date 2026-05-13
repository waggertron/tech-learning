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
	INF := amount + 1
	dp := make([]int, amount+1)
	for i := range dp {
		dp[i] = INF
	}
	dp[0] = 0
	min := func(a, b int) int {
		if a < b {
			return a
		}
		return b
	}
	for i := 1; i <= amount; i++ {
		for _, c := range coins {
			if c <= i {
				dp[i] = min(dp[i], dp[i-c]+1)
			}
		}
	}
	if dp[amount] == INF {
		return -1
	}
	return dp[amount]
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
