package main

import (
	"container/heap"
	"fmt"
)

func abs1584h(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

type Item1584 struct{ d, u int }
type MinHeap1584 []Item1584

func (h MinHeap1584) Len() int            { return len(h) }
func (h MinHeap1584) Less(i, j int) bool  { return h[i].d < h[j].d }
func (h MinHeap1584) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MinHeap1584) Push(x interface{}) { *h = append(*h, x.(Item1584)) }
func (h *MinHeap1584) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func minCostConnectPoints(points [][]int) int {
	n := len(points)
	visited := make([]bool, n)
	h := &MinHeap1584{{d: 0, u: 0}}
	heap.Init(h)
	total, count := 0, 0

	for h.Len() > 0 && count < n {
		item := heap.Pop(h).(Item1584)
		d, u := item.d, item.u
		if visited[u] {
			continue
		}
		visited[u] = true
		total += d
		count++
		for v := 0; v < n; v++ {
			if !visited[v] {
				dist := abs1584h(points[u][0]-points[v][0]) + abs1584h(points[u][1]-points[v][1])
				heap.Push(h, Item1584{d: dist, u: v})
			}
		}
	}
	return total
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
	assert(minCostConnectPoints([][]int{{0, 0}, {2, 2}, {3, 10}, {5, 2}, {7, 0}}) == 20)
	assert(minCostConnectPoints([][]int{{3, 12}, {-2, 5}, {-4, 1}}) == 18)
	assert(minCostConnectPoints([][]int{{0, 0}}) == 0)
	assert(minCostConnectPoints([][]int{{0, 0}, {1, 1}}) == 2)
	assert(minCostConnectPoints([][]int{{0, 0}, {1, 0}, {2, 0}, {3, 0}}) == 3)
	fmt.Println("all tests pass")
}

func main() { runTests() }
