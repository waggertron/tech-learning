package main

import "fmt"

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func minMeetingRooms(intervals [][]int) int {
	// TODO: implement
	return 0
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
