package main

import "fmt"

func change(amount int, coins []int) int {
	memo := make(map[[2]int]int)
	var f func(i, remaining int) int
	f = func(i, remaining int) int {
		if remaining == 0 {
			return 1
		}
		if remaining < 0 || i == len(coins) {
			return 0
		}
		key := [2]int{i, remaining}
		if v, ok := memo[key]; ok {
			return v
		}
		result := f(i, remaining-coins[i]) + f(i+1, remaining)
		memo[key] = result
		return result
	}
	return f(0, amount)
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
