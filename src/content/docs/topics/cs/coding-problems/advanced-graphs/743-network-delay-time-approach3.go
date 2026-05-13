package main

import (
	"container/heap"
	"fmt"
)

type Item743 struct {
	node, dist int
}

type MinHeap743 []Item743

func (h MinHeap743) Len() int            { return len(h) }
func (h MinHeap743) Less(i, j int) bool  { return h[i].dist < h[j].dist }
func (h MinHeap743) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MinHeap743) Push(x interface{}) { *h = append(*h, x.(Item743)) }
func (h *MinHeap743) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func networkDelayTime(times [][]int, n int, k int) int {
	graph := make(map[int][][2]int)
	for _, t := range times {
		u, v, w := t[0], t[1], t[2]
		graph[u] = append(graph[u], [2]int{v, w})
	}

	dist := make(map[int]int)
	dist[k] = 0
	h := &MinHeap743{{node: k, dist: 0}}
	heap.Init(h)

	for h.Len() > 0 {
		item := heap.Pop(h).(Item743)
		d, u := item.dist, item.node
		if best, ok := dist[u]; ok && d > best {
			continue
		}
		for _, edge := range graph[u] {
			v, w := edge[0], edge[1]
			nd := d + w
			if best, ok := dist[v]; !ok || nd < best {
				dist[v] = nd
				heap.Push(h, Item743{node: v, dist: nd})
				heap.Fix(h, h.Len()-1)
			}
		}
	}

	if len(dist) != n {
		return -1
	}
	m := 0
	for _, v := range dist {
		if v > m {
			m = v
		}
	}
	return m
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
	assert(networkDelayTime([][]int{{2, 1, 1}, {2, 3, 1}, {3, 4, 1}}, 4, 2) == 2)
	assert(networkDelayTime([][]int{{1, 2, 1}}, 2, 1) == 1)
	assert(networkDelayTime([][]int{{1, 2, 1}}, 2, 2) == -1)
	assert(networkDelayTime([][]int{}, 1, 1) == 0)
	assert(networkDelayTime([][]int{{1, 2, 1}, {1, 2, 5}}, 2, 1) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
