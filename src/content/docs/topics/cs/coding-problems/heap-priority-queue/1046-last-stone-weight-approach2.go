package main

import (
	"container/heap"
	"fmt"
)

type MaxHeap []int

func (h MaxHeap) Len() int            { return len(h) }
func (h MaxHeap) Less(i, j int) bool  { return h[i] > h[j] }
func (h MaxHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MaxHeap) Push(x any)         { *h = append(*h, x.(int)) }
func (h *MaxHeap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func lastStoneWeight(stones []int) int {
	h := make(MaxHeap, len(stones))
	copy(h, stones)
	heap.Init(&h)                      // L1+L2: O(n) build max-heap
	for h.Len() > 1 {                  // L3: outer loop, up to n-1 rounds
		y := heap.Pop(&h).(int)        // L4: O(log n) pop largest
		x := heap.Pop(&h).(int)        // L5: O(log n) pop second largest
		if x != y {
			heap.Push(&h, y-x)         // L6: O(log n) push remainder
		}
	}
	if h.Len() > 0 {
		return h[0]
	}
	return 0
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
	assert(lastStoneWeight([]int{2, 7, 4, 1, 8, 1}) == 1)
	assert(lastStoneWeight([]int{1}) == 1)
	assert(lastStoneWeight([]int{31, 26, 33, 21, 40}) == 9)
	assert(lastStoneWeight([]int{9, 3, 2, 10}) == 0)
	assert(lastStoneWeight([]int{2, 2}) == 0)
	assert(lastStoneWeight([]int{1, 3}) == 2)
	fmt.Println("all tests pass")
}

func main() { runTests() }
