package main

import (
	"fmt"
	"sort"
)

func canAttendMeetings(intervals [][]int) bool {
	sort.Slice(intervals, func(i, j int) bool {
		return intervals[i][0] < intervals[j][0]
	})
	for i := 1; i < len(intervals); i++ {
		if intervals[i][0] < intervals[i-1][1] {
			return false
		}
	}
	return true
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
	assert(canAttendMeetings([][]int{{0, 30}, {5, 10}, {15, 20}}) == false)
	assert(canAttendMeetings([][]int{{7, 10}, {2, 4}}) == true)
	assert(canAttendMeetings([][]int{}) == true)
	assert(canAttendMeetings([][]int{{1, 5}}) == true)
	assert(canAttendMeetings([][]int{{1, 5}, {5, 10}}) == true)
	assert(canAttendMeetings([][]int{{1, 6}, {5, 10}}) == false)
	fmt.Println("all tests pass")
}

func main() { runTests() }
