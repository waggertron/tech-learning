package main

import (
	"fmt"
	"sort"
)

func partitionLabels(s string) []int {
	first := make(map[byte]int)
	last := make(map[byte]int)
	for i := 0; i < len(s); i++ {
		if _, ok := first[s[i]]; !ok {
			first[s[i]] = i
		}
		last[s[i]] = i
	}
	type interval struct{ a, b int }
	var intervals []interval
	for ch := range first {
		intervals = append(intervals, interval{first[ch], last[ch]})
	}
	sort.Slice(intervals, func(i, j int) bool {
		return intervals[i].a < intervals[j].a
	})
	var merged []interval
	for _, iv := range intervals {
		if len(merged) > 0 && iv.a <= merged[len(merged)-1].b {
			if iv.b > merged[len(merged)-1].b {
				merged[len(merged)-1].b = iv.b
			}
		} else {
			merged = append(merged, iv)
		}
	}
	var result []int
	for _, iv := range merged {
		result = append(result, iv.b-iv.a+1)
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
