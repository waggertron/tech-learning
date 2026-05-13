package main

import "fmt"

func maxProfit(prices []int) int {
	n := len(prices)
	if n == 0 {
		return 0
	}
	type key struct{ i, holding, cooldown int }
	memo := make(map[key]int)
	var f func(i, holding, cooldown int) int
	f = func(i, holding, cooldown int) int {
		if i == n {
			return 0
		}
		k := key{i, holding, cooldown}
		if v, ok := memo[k]; ok {
			return v
		}
		best := f(i+1, holding, 0)
		if holding == 1 {
			if v := prices[i] + f(i+1, 0, 1); v > best {
				best = v
			}
		} else if cooldown == 0 {
			if v := -prices[i] + f(i+1, 1, 0); v > best {
				best = v
			}
		}
		memo[k] = best
		return best
	}
	return f(0, 0, 0)
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
