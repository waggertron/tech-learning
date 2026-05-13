package main

import "fmt"

func minDistance(word1 string, word2 string) int {
	min := func(a, b int) int {
		if a < b {
			return a
		}
		return b
	}
	m, n := len(word1), len(word2)
	memo := make(map[[2]int]int)
	var f func(i, j int) int
	f = func(i, j int) int {
		if i == m {
			return n - j
		}
		if j == n {
			return m - i
		}
		key := [2]int{i, j}
		if v, ok := memo[key]; ok {
			return v
		}
		var result int
		if word1[i] == word2[j] {
			result = f(i+1, j+1)
		} else {
			result = 1 + min(f(i+1, j), min(f(i, j+1), f(i+1, j+1)))
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
	assert(minDistance("horse", "ros") == 3)
	assert(minDistance("intention", "execution") == 5)
	assert(minDistance("", "") == 0)
	assert(minDistance("abc", "") == 3)
	assert(minDistance("", "abc") == 3)
	assert(minDistance("abc", "abc") == 0)
	fmt.Println("all tests pass")
}
