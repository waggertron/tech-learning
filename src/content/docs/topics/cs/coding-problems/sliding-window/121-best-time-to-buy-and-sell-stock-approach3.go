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
	lowest := 1<<63 - 1 // math.MaxInt
	best := 0
	for _, price := range prices {
		if price < lowest {
			lowest = price
		} else if price-lowest > best {
			best = price - lowest
		}
	}
	return best
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
