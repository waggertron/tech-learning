package main

import (
	"fmt"
	"reflect"
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

func criticalConnections(n int, connections [][]int) [][]int {
	// TODO: implement
	return nil
}

func runTests() {
	assert(reflect.DeepEqual(criticalConnections(4, [][]int{{0, 1}, {1, 2}, {2, 0}, {1, 3}}), [][]int{{1, 3}}))
	assert(reflect.DeepEqual(criticalConnections(2, [][]int{{0, 1}}), [][]int{{0, 1}}))
	result := criticalConnections(3, [][]int{{0, 1}, {1, 2}, {0, 2}})
	assert(len(result) == 0)
	fmt.Println("all tests pass")
}

func main() { runTests() }
