package main

import "fmt"

func partitionLabels(s string) []int {
	last := make(map[byte]int)
	for i := 0; i < len(s); i++ {
		last[s[i]] = i
	}
	var result []int
	start := 0
	end := 0
	for i := 0; i < len(s); i++ {
		if last[s[i]] > end {
			end = last[s[i]]
		}
		if i == end {
			result = append(result, i-start+1)
			start = i + 1
		}
	}
	return result
}

func main() {
	slicesEqual := func(a, b []int) bool {
		if len(a) != len(b) {
			return false
		}
		for i := range a {
			if a[i] != b[i] {
				return false
			}
		}
		return true
	}
	assert := func(condition bool) {
		if !condition {
			panic("assertion failed")
		}
	}
	assert(slicesEqual(partitionLabels("ababcbacadefegdehijhklij"), []int{9, 7, 8}))
	assert(slicesEqual(partitionLabels("eccbbbbdec"), []int{10}))
	assert(slicesEqual(partitionLabels("a"), []int{1}))
	assert(slicesEqual(partitionLabels("abcd"), []int{1, 1, 1, 1}))
	assert(slicesEqual(partitionLabels("aabb"), []int{2, 2}))
	fmt.Println("all tests pass")
}
