package main

import "fmt"

func isMatch(s string, p string) bool {
	memo := make(map[[2]int]bool)
	visited := make(map[[2]int]bool)
	var match func(i, j int) bool
	match = func(i, j int) bool {
		if j == len(p) {
			return i == len(s)
		}
		key := [2]int{i, j}
		if visited[key] {
			return memo[key]
		}
		visited[key] = true
		first := i < len(s) && (p[j] == '.' || p[j] == s[i])
		var result bool
		if j+1 < len(p) && p[j+1] == '*' {
			result = match(i, j+2) || (first && match(i+1, j))
		} else {
			result = first && match(i+1, j+1)
		}
		memo[key] = result
		return result
	}
	return match(0, 0)
}

func main() {
	assert := func(cond bool) {
		if !cond {
			panic("assertion failed")
		}
	}
	assert(isMatch("aa", "a") == false)
	assert(isMatch("aa", "a*") == true)
	assert(isMatch("ab", ".*") == true)
	assert(isMatch("mississippi", "mis*is*p*.") == false)
	assert(isMatch("", "") == true)
	assert(isMatch("", "a*") == true)
	fmt.Println("all tests pass")
}
