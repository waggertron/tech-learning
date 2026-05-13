package main

import (
	"fmt"
	"sort"
)

func minMeetingRooms(intervals [][]int) int {
	if len(intervals) == 0 {
		return 0
	}
	starts := make([]int, len(intervals))
	ends := make([]int, len(intervals))
	for i, iv := range intervals {
		starts[i] = iv[0]
		ends[i] = iv[1]
	}
	sort.Ints(starts)
	sort.Ints(ends)

	i, j := 0, 0
	used, best := 0, 0
	for i < len(intervals) {
		if starts[i] < ends[j] {
			used++
			if used > best {
				best = used
			}
			i++
		} else {
			used--
			j++
		}
	}
	return best
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
	assert(minMeetingRooms([][]int{{0, 30}, {5, 10}, {15, 20}}) == 2)
	assert(minMeetingRooms([][]int{{7, 10}, {2, 4}}) == 1)
	assert(minMeetingRooms([][]int{{1, 5}}) == 1)
	assert(minMeetingRooms([][]int{}) == 0)
	assert(minMeetingRooms([][]int{{1, 4}, {2, 5}, {3, 6}}) == 3)
	assert(minMeetingRooms([][]int{{0, 5}, {5, 10}, {10, 15}}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
