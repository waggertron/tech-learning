package main

import (
	"fmt"
	"sort"
)

func canAttendMeetings(intervals [][]int) bool {
	type event struct {
		time  int
		delta int
	}
	events := make([]event, 0, len(intervals)*2)
	for _, iv := range intervals {
		events = append(events, event{iv[0], 1})
		events = append(events, event{iv[1], -1})
	}
	sort.Slice(events, func(i, j int) bool {
		if events[i].time != events[j].time {
			return events[i].time < events[j].time
		}
		return events[i].delta < events[j].delta
	})
	cur := 0
	for _, e := range events {
		cur += e.delta
		if cur > 1 {
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
