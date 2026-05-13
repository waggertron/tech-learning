package main

import "fmt"

func maxProfit(prices []int) int {
	max := func(a, b int) int {
		if a > b {
			return a
		}
		return b
	}
	if len(prices) == 0 {
		return 0
	}
	hold := -prices[0]
	sold := 0
	rest := 0
	for i := 1; i < len(prices); i++ {
		prevHold, prevSold, prevRest := hold, sold, rest
		hold = max(prevHold, prevRest-prices[i])
		sold = prevHold + prices[i]
		rest = max(prevRest, prevSold)
	}
	return max(sold, rest)
}

func main() {
	assert := func(cond bool) {
		if !cond {
			panic("assertion failed")
		}
	}
	assert(maxProfit([]int{1, 2, 3, 0, 2}) == 3)
	assert(maxProfit([]int{1}) == 0)
	assert(maxProfit([]int{}) == 0)
	assert(maxProfit([]int{5, 4, 3, 2, 1}) == 0)
	assert(maxProfit([]int{1, 2, 3, 4, 5}) == 4)
	assert(maxProfit([]int{1, 2}) == 1)
	fmt.Println("all tests pass")
}
