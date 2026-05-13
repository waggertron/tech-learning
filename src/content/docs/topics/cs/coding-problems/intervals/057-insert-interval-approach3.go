package main

import "fmt"

func insert(intervals [][]int, newInterval []int) [][]int {
	result := [][]int{}
	i := 0
	n := len(intervals)

	// 1. before
	for i < n && intervals[i][1] < newInterval[0] {
		result = append(result, []int{intervals[i][0], intervals[i][1]})
		i++
	}

	// 2. overlap
	for i < n && intervals[i][0] <= newInterval[1] {
		if intervals[i][0] < newInterval[0] {
			newInterval[0] = intervals[i][0]
		}
		if intervals[i][1] > newInterval[1] {
			newInterval[1] = intervals[i][1]
		}
		i++
	}
	result = append(result, []int{newInterval[0], newInterval[1]})

	// 3. after
	for i < n {
		result = append(result, []int{intervals[i][0], intervals[i][1]})
		i++
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
