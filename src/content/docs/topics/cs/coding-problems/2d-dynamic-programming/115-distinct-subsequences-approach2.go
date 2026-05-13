package main

import "fmt"

func numDistinct(s string, t string) int {
	memo := make(map[[2]int]int)
	var f func(i, j int) int
	f = func(i, j int) int {
		if j == len(t) {
			return 1
		}
		if i == len(s) {
			return 0
		}
		key := [2]int{i, j}
		if v, ok := memo[key]; ok {
			return v
		}
		result := 0
		if s[i] == t[j] {
			result = f(i+1, j+1) + f(i+1, j)
		} else {
			result = f(i+1, j)
		}
		memo[key] = result
		return result
	}
	return f(0, 0)
}

func main() {
	assert := func(cond bool) {
		if !cond {
			panic("assertion failed")
		}
	}
	assert(numDistinct("rabbbit", "rabbit") == 3)
	assert(numDistinct("babgbag", "bag") == 5)
	assert(numDistinct("abc", "") == 1)
	assert(numDistinct("", "a") == 0)
	assert(numDistinct("abc", "abc") == 1)
	assert(numDistinct("aaa", "b") == 0)
	fmt.Println("all tests pass")
}
