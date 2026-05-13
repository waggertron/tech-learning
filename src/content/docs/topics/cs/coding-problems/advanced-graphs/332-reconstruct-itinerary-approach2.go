package main

import (
	"container/heap"
	"fmt"
	"reflect"
)

type StringHeap []string

func (h StringHeap) Len() int            { return len(h) }
func (h StringHeap) Less(i, j int) bool  { return h[i] < h[j] }
func (h StringHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *StringHeap) Push(x interface{}) { *h = append(*h, x.(string)) }
func (h *StringHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func findItinerary(tickets [][]string) []string {
	graph := make(map[string]*StringHeap)
	for _, t := range tickets {
		src, dst := t[0], t[1]
		if graph[src] == nil {
			graph[src] = &StringHeap{}
			heap.Init(graph[src])
		}
		heap.Push(graph[src], dst)
	}

	var itinerary []string
	var dfs func(node string)
	dfs = func(node string) {
		for graph[node] != nil && graph[node].Len() > 0 {
			nb := heap.Pop(graph[node]).(string)
			dfs(nb)
		}
		itinerary = append(itinerary, node)
	}

	dfs("JFK")
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
