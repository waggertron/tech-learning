package main

import "fmt"

func isInterleave(s1 string, s2 string, s3 string) bool {
	if len(s1)+len(s2) != len(s3) {
		return false
	}
	memo := make(map[[2]int]bool)
	visited := make(map[[2]int]bool)
	var f func(i, j int) bool
	f = func(i, j int) bool {
		k := i + j
		if k == len(s3) {
			return true
		}
		key := [2]int{i, j}
		if visited[key] {
			return memo[key]
		}
		visited[key] = true
		result := false
		if i < len(s1) && s1[i] == s3[k] && f(i+1, j) {
			result = true
		}
		if !result && j < len(s2) && s2[j] == s3[k] && f(i, j+1) {
			result = true
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
	assert(isInterleave("aabcc", "dbbca", "aadbbcbcac") == true)
	assert(isInterleave("aabcc", "dbbca", "aadbbbaccc") == false)
	assert(isInterleave("", "", "") == true)
	assert(isInterleave("a", "", "a") == true)
	assert(isInterleave("", "b", "b") == true)
	assert(isInterleave("a", "b", "abc") == false)
	fmt.Println("all tests pass")
}
