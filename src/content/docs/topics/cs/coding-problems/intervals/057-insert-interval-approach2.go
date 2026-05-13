package main

import (
	"fmt"
	"sort"
)

func insert(intervals [][]int, newInterval []int) [][]int {
	all := make([][]int, len(intervals)+1)
	for i, iv := range intervals {
		all[i] = []int{iv[0], iv[1]}
	}
	all[len(intervals)] = []int{newInterval[0], newInterval[1]}
	sort.Slice(all, func(i, j int) bool {
		return all[i][0] < all[j][0]
	})
	result := [][]int{}
	for _, iv := range all {
		if len(result) > 0 && iv[0] <= result[len(result)-1][1] {
			if iv[1] > result[len(result)-1][1] {
				result[len(result)-1][1] = iv[1]
			}
		} else {
			result = append(result, []int{iv[0], iv[1]})
		}
	}
	return result
}

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func slices2DEqual(a, b [][]int) bool {
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
	assert(slices2DEqual(insert([][]int{{1, 3}, {6, 9}}, []int{2, 5}), [][]int{{1, 5}, {6, 9}}))
	assert(slices2DEqual(insert([][]int{{1, 2}, {3, 5}, {6, 7}, {8, 10}, {12, 16}}, []int{4, 8}), [][]int{{1, 2}, {3, 10}, {12, 16}}))
	assert(slices2DEqual(insert([][]int{{3, 5}, {6, 9}}, []int{1, 2}), [][]int{{1, 2}, {3, 5}, {6, 9}}))
	assert(slices2DEqual(insert([][]int{{1, 2}, {3, 5}}, []int{7, 9}), [][]int{{1, 2}, {3, 5}, {7, 9}}))
	assert(slices2DEqual(insert([][]int{{1, 2}, {3, 4}, {5, 6}}, []int{0, 10}), [][]int{{0, 10}}))
	assert(slices2DEqual(insert([][]int{}, []int{1, 5}), [][]int{{1, 5}}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
