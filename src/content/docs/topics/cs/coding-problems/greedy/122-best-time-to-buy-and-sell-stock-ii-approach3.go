package main

import (
	"fmt"
	"math"
)

func maxProfit(prices []int) int {
	cash := 0                       // best profit while holding no share
	hold := math.MinInt32           // best profit while holding one share
	for _, p := range prices {
		cash = max(cash, hold+p)    // sell today, or stay in cash
		hold = max(hold, cash-p)    // buy today, or keep holding
	}
	return cash
}

func main() {
	fmt.Println(maxProfit([]int{7, 1, 5, 3, 6, 4})) // 7
	fmt.Println(maxProfit([]int{1, 2, 3, 4, 5}))    // 4
	fmt.Println(maxProfit([]int{7, 6, 4, 3, 1}))    // 0
}
