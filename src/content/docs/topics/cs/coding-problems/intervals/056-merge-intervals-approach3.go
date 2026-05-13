package main

import "fmt"

func merge(intervals [][]int) [][]int {
	if len(intervals) == 0 {
		return [][]int{}
	}
	maxV := 0
	for _, iv := range intervals {
		if iv[1] > maxV {
			maxV = iv[1]
		}
	}
	starts := make([]int, maxV+2)
	ends := make([]int, maxV+2)
	for _, iv := range intervals {
		starts[iv[0]]++
		ends[iv[1]]++
	}

	result := [][]int{}
	openCount := 0
	curStart := 0
	for i := 0; i < maxV+2; i++ {
		if starts[i] > 0 && openCount == 0 {
			curStart = i
		}
		openCount += starts[i]
		if ends[i] > 0 {
			openCount -= ends[i]
			if openCount == 0 {
				result = append(result, []int{curStart, i})
			}
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
	assert(slices2DEqual(merge([][]int{{1, 3}, {2, 6}, {8, 10}, {15, 18}}), [][]int{{1, 6}, {8, 10}, {15, 18}}))
	assert(slices2DEqual(merge([][]int{{1, 4}, {4, 5}}), [][]int{{1, 5}}))
	assert(slices2DEqual(merge([][]int{{1, 2}}), [][]int{{1, 2}}))
	assert(slices2DEqual(merge([][]int{{1, 10}, {2, 5}, {3, 8}}), [][]int{{1, 10}}))
	assert(slices2DEqual(merge([][]int{{1, 2}, {3, 4}, {5, 6}}), [][]int{{1, 2}, {3, 4}, {5, 6}}))
	assert(slices2DEqual(merge([][]int{{15, 18}, {1, 3}, {2, 6}, {8, 10}}), [][]int{{1, 6}, {8, 10}, {15, 18}}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
