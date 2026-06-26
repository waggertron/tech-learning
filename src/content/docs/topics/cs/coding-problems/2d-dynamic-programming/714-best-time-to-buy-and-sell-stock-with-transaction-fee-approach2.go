package main

import "fmt"

func maxProfit(prices []int, fee int) int {
	cash := 0                                // best profit holding no share
	hold := -prices[0]                       // best profit holding one share
	for _, p := range prices[1:] {
		cash = max(cash, hold+p-fee)         // sell today, pay the fee once
		hold = max(hold, cash-p)             // buy today, or keep holding
	}
	return cash
}

func main() {
	fmt.Println(maxProfit([]int{1, 3, 2, 8, 4, 9}, 2))  // 8
	fmt.Println(maxProfit([]int{1, 3, 7, 5, 10, 3}, 3)) // 6
}
