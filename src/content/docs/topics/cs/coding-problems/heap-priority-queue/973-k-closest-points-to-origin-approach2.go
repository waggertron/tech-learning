package main

import (
	"container/heap"
	"fmt"
)

// Max-heap on negated squared distance: farthest point sits at the top.
type entry struct {
	negDist, x, y int
}

type MaxHeap []entry

func (h MaxHeap) Len() int            { return len(h) }
func (h MaxHeap) Less(i, j int) bool  { return h[i].negDist > h[j].negDist }
func (h MaxHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MaxHeap) Push(x any)         { *h = append(*h, x.(entry)) }
func (h *MaxHeap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func kClosest(points [][]int, k int) [][]int {
	h := &MaxHeap{}
	heap.Init(h)
	for _, p := range points { // L1: iterate n points
		x, y := p[0], p[1]
		d := -(x*x + y*y)
		if h.Len() < k {
			heap.Push(h, entry{d, x, y}) // L2: O(log k) push
		} else if d > (*h)[0].negDist {
			// L3: O(log k) replace farthest
			heap.Pop(h)
			heap.Push(h, entry{d, x, y})
		}
	}
	result := make([][]int, h.Len())
	for i, e := range *h {
		result[i] = []int{e.x, e.y}
	}
	return result
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
	result := kClosest([][]int{{1, 3}, {-2, 2}}, 1)
	assert(len(result) == 1 && result[0][0] == -2 && result[0][1] == 2)

	result2 := kClosest([][]int{{3, 3}, {5, -1}, {-2, 4}}, 2)
	assert(len(result2) == 2)

	result3 := kClosest([][]int{{0, 0}}, 1)
	assert(len(result3) == 1 && result3[0][0] == 0 && result3[0][1] == 0)

	result4 := kClosest([][]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}, 2)
	assert(len(result4) == 2)

	result5 := kClosest([][]int{{1, 2}, {3, 4}, {0, 0}}, 3)
	assert(len(result5) == 3)

	fmt.Println("all tests pass")
}

func main() { runTests() }
