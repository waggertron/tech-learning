package main

import (
	"fmt"
	"sort"
)

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func groupAnagrams(strs []string) [][]string {
	type key [26]int
	groups := make(map[key][]string)
	for _, s := range strs {
		var count key
		for _, ch := range s {
			count[ch-'a']++
		}
		groups[count] = append(groups[count], s)
	}
	result := make([][]string, 0, len(groups))
	for _, g := range groups {
		result = append(result, g)
	}
	return result
}

func normalize(result [][]string) [][]string {
	for i := range result {
		sort.Strings(result[i])
	}
	sort.Slice(result, func(i, j int) bool {
		if len(result[i]) == 0 {
			return true
		}
		if len(result[j]) == 0 {
			return false
		}
		return result[i][0] < result[j][0]
	})
	return result
}

func sliceEqual(a, b [][]string) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if len(a[i]) != len(b[i]) {
			return false
		}
		for j := range a[i] {
			if a[i][j] != b[i][j] {
				return false
			}
		}
	}
	return true
}

func runTests() {
	r1 := normalize(groupAnagrams([]string{"eat", "tea", "tan", "ate", "nat", "bat"}))
	exp1 := [][]string{{"ate", "eat", "tea"}, {"bat"}, {"nat", "tan"}}
	assert(sliceEqual(r1, exp1), "test 1")

	r2 := normalize(groupAnagrams([]string{""}))
	exp2 := [][]string{{""}}
	assert(sliceEqual(r2, exp2), "test 2")

	r3 := normalize(groupAnagrams([]string{"a"}))
	exp3 := [][]string{{"a"}}
	assert(sliceEqual(r3, exp3), "test 3")

	fmt.Println("all tests pass")
}

func main() { runTests() }
