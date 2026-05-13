package main

import (
	"container/heap"
	"fmt"
	"math"
)

type Item1514 struct {
	negP float64
	node int
}

type MinHeap1514 []Item1514

func (h MinHeap1514) Len() int            { return len(h) }
func (h MinHeap1514) Less(i, j int) bool  { return h[i].negP < h[j].negP }
func (h MinHeap1514) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MinHeap1514) Push(x interface{}) { *h = append(*h, x.(Item1514)) }
func (h *MinHeap1514) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func maxProbability(n int, edges [][]int, succProb []float64, start int, end int) float64 {
	graph := make([][]struct {
		v    int
		prob float64
	}, n)
	for i, e := range edges {
		u, v := e[0], e[1]
		graph[u] = append(graph[u], struct {
			v    int
			prob float64
		}{v, succProb[i]})
		graph[v] = append(graph[v], struct {
			v    int
			prob float64
		}{u, succProb[i]})
	}

	prob := make([]float64, n)
	prob[start] = 1.0
	h := &MinHeap1514{{negP: -1.0, node: start}}
	heap.Init(h)

	for h.Len() > 0 {
		item := heap.Pop(h).(Item1514)
		p, u := -item.negP, item.node
		if p < prob[u] {
			continue
		}
		if u == end {
			return p
		}
		for _, edge := range graph[u] {
			newP := p * edge.prob
			if newP > prob[edge.v] {
				prob[edge.v] = newP
				heap.Push(h, Item1514{negP: -newP, node: edge.v})
			}
		}
	}
	return prob[end]
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
	assert(math.Abs(maxProbability(3, [][]int{{0, 1}, {1, 2}, {0, 2}}, []float64{0.5, 0.5, 0.2}, 0, 2)-0.25) < 1e-5)
	assert(math.Abs(maxProbability(3, [][]int{{0, 1}, {1, 2}, {0, 2}}, []float64{0.5, 0.5, 0.3}, 0, 2)-0.3) < 1e-5)
	assert(maxProbability(3, [][]int{{0, 1}}, []float64{0.5}, 0, 2) == 0.0)
	assert(math.Abs(maxProbability(2, [][]int{{0, 1}}, []float64{0.9}, 0, 1)-0.9) < 1e-5)
	assert(math.Abs(maxProbability(3, [][]int{{0, 1}, {1, 2}}, []float64{0.5, 0.5}, 1, 1)-1.0) < 1e-5)
	fmt.Println("all tests pass")
}

func main() { runTests() }
