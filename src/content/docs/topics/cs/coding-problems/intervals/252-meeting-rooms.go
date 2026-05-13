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

func canAttendMeetings(intervals [][]int) bool {
	// TODO: implement
	return false
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
