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

func findItinerary(tickets [][]string) []string {
	// TODO: implement
	return nil
}

func runTests() {
	assert(reflect.DeepEqual(
		findItinerary([][]string{{"MUC", "LHR"}, {"JFK", "MUC"}, {"SFO", "SJC"}, {"LHR", "SFO"}}),
		[]string{"JFK", "MUC", "LHR", "SFO", "SJC"},
	))
	assert(reflect.DeepEqual(
		findItinerary([][]string{{"JFK", "SFO"}, {"JFK", "ATL"}, {"SFO", "ATL"}, {"ATL", "JFK"}, {"ATL", "SFO"}}),
		[]string{"JFK", "ATL", "JFK", "SFO", "ATL", "SFO"},
	))
	assert(reflect.DeepEqual(
		findItinerary([][]string{{"JFK", "ATL"}}),
		[]string{"JFK", "ATL"},
	))
	assert(reflect.DeepEqual(
		findItinerary([][]string{{"JFK", "A"}, {"A", "B"}, {"B", "C"}}),
		[]string{"JFK", "A", "B", "C"},
	))
	assert(reflect.DeepEqual(
		findItinerary([][]string{{"JFK", "ATL"}, {"ATL", "JFK"}}),
		[]string{"JFK", "ATL", "JFK"},
	))
	fmt.Println("all tests pass")
}

func main() { runTests() }
