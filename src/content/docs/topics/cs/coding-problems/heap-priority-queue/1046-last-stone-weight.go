package main

import (
	"container/heap"
	"fmt"
)

// MaxHeap for last stone weight (we always want the two heaviest)
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

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func lastStoneWeight(stones []int) int {
	// TODO: implement
	return 0
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
