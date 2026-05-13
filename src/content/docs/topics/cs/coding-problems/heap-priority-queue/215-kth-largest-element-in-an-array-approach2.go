package main

import (
	"container/heap"
	"fmt"
)

type MinHeap []int

func (h MinHeap) Len() int            { return len(h) }
func (h MinHeap) Less(i, j int) bool  { return h[i] < h[j] }
func (h MinHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MinHeap) Push(x any)         { *h = append(*h, x.(int)) }
func (h *MinHeap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func findKthLargest(nums []int, k int) int {
	h := &MinHeap{}
	heap.Init(h)
	for _, x := range nums { // L1: iterate n elements
		heap.Push(h, x)      // L2: O(log k) push
		if h.Len() > k {
			heap.Pop(h)      // L3: O(log k) pop to keep size k
		}
	}
	return (*h)[0]
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
	assert(findKthLargest([]int{3, 2, 1, 5, 6, 4}, 2) == 5)
	assert(findKthLargest([]int{3, 2, 3, 1, 2, 4, 5, 5, 6}, 4) == 4)
	assert(findKthLargest([]int{1}, 1) == 1)
	assert(findKthLargest([]int{2, 2, 2, 2}, 2) == 2)
	assert(findKthLargest([]int{5, 3, 1, 4, 2}, 5) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
