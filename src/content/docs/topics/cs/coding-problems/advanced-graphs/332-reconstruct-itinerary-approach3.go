package main

import (
	"fmt"
	"reflect"
	"sort"
)

func findItinerary(tickets [][]string) []string {
	graph := make(map[string][]string)
	// sort descending so pop from end gives lexicographically smallest
	sort.Slice(tickets, func(i, j int) bool {
		if tickets[i][0] != tickets[j][0] {
			return tickets[i][0] > tickets[j][0]
		}
		return tickets[i][1] > tickets[j][1]
	})
	for _, t := range tickets {
		src, dst := t[0], t[1]
		graph[src] = append(graph[src], dst)
	}

	var itinerary []string
	stack := []string{"JFK"}
	for len(stack) > 0 {
		top := stack[len(stack)-1]
		if neighbors, ok := graph[top]; ok && len(neighbors) > 0 {
			next := neighbors[len(neighbors)-1]
			graph[top] = neighbors[:len(neighbors)-1]
			stack = append(stack, next)
		} else {
			itinerary = append(itinerary, stack[len(stack)-1])
			stack = stack[:len(stack)-1]
		}
	}
	// reverse
	for i, j := 0, len(itinerary)-1; i < j; i, j = i+1, j-1 {
		itinerary[i], itinerary[j] = itinerary[j], itinerary[i]
	}
	return itinerary
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
