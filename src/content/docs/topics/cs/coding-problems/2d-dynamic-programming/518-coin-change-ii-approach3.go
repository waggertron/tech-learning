package main

import "fmt"

func change(amount int, coins []int) int {
	dp := make([]int, amount+1)
	dp[0] = 1
	for _, c := range coins {
		for s := c; s <= amount; s++ {
			dp[s] += dp[s-c]
		}
	}
	return dp[amount]
}

func main() {
	assert := func(cond bool) {
		if !cond {
			panic("assertion failed")
		}
	}
	assert(change(5, []int{1, 2, 5}) == 4)
	assert(change(3, []int{2}) == 0)
	assert(change(0, []int{1, 2, 5}) == 1)
	assert(change(10, []int{5}) == 1)
	assert(change(10, []int{1, 5, 10}) == 4)
	fmt.Println("all tests pass")
}
