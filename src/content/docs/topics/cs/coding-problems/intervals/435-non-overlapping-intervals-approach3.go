package main

import (
	"fmt"
	"math"
	"sort"
)

func eraseOverlapIntervals(intervals [][]int) int {
	sort.Slice(intervals, func(i, j int) bool {
		return intervals[i][0] < intervals[j][0]
	})
	count := 0
	prevEnd := math.MinInt64
	for _, iv := range intervals {
		if iv[0] >= prevEnd {
			prevEnd = iv[1]
		} else {
			count++
			if iv[1] < prevEnd {
				prevEnd = iv[1]
			}
		}
	}
	return count
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

func runTests() {
	assert(eraseOverlapIntervals([][]int{{1, 2}, {2, 3}, {3, 4}, {1, 3}}) == 1)
	assert(eraseOverlapIntervals([][]int{{1, 2}, {1, 2}, {1, 2}}) == 2)
	assert(eraseOverlapIntervals([][]int{{1, 2}, {2, 3}}) == 0)
	assert(eraseOverlapIntervals([][]int{{1, 5}}) == 0)
	assert(eraseOverlapIntervals([][]int{}) == 0)
	assert(eraseOverlapIntervals([][]int{{1, 100}, {2, 3}, {4, 5}, {6, 7}}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
