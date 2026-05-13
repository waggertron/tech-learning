package main

import (
	"container/heap"
	"fmt"
)

type Item787 struct {
	cost, city, stops int
}

type MinHeap787 []Item787

func (h MinHeap787) Len() int            { return len(h) }
func (h MinHeap787) Less(i, j int) bool  { return h[i].cost < h[j].cost }
func (h MinHeap787) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MinHeap787) Push(x interface{}) { *h = append(*h, x.(Item787)) }
func (h *MinHeap787) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func findCheapestPrice(n int, flights [][]int, src int, dst int, k int) int {
	graph := make(map[int][][2]int)
	for _, f := range flights {
		u, v, w := f[0], f[1], f[2]
		graph[u] = append(graph[u], [2]int{v, w})
	}
	h := &MinHeap787{{cost: 0, city: src, stops: k + 1}}
	heap.Init(h)
	for h.Len() > 0 {
		item := heap.Pop(h).(Item787)
		cost, city, stops := item.cost, item.city, item.stops
		if city == dst {
			return cost
		}
		if stops > 0 {
			for _, edge := range graph[city] {
				nb, w := edge[0], edge[1]
				heap.Push(h, Item787{cost: cost + w, city: nb, stops: stops - 1})
			}
		}
	}
	return -1
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
	flights := [][]int{{0, 1, 100}, {1, 2, 100}, {2, 0, 100}, {1, 3, 600}, {2, 3, 200}}
	assert(findCheapestPrice(4, flights, 0, 3, 1) == 700)
	assert(findCheapestPrice(4, flights, 0, 3, 0) == -1)
	assert(findCheapestPrice(4, flights, 0, 3, 2) == 400)
	assert(findCheapestPrice(2, [][]int{{0, 1, 500}}, 0, 1, 0) == 500)
	assert(findCheapestPrice(3, [][]int{{0, 1, 100}, {1, 2, 50}}, 1, 1, 1) == 0)
	assert(findCheapestPrice(3, [][]int{{0, 1, 100}}, 0, 2, 5) == -1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
