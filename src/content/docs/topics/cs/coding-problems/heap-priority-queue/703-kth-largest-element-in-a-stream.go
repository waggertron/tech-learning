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

type KthLargest struct {
	k    int
	heap *MinHeap
}

func Constructor(k int, nums []int) KthLargest {
	// TODO: implement
	return KthLargest{}
}

func (kl *KthLargest) Add(val int) int {
	// TODO: implement
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
	kl := Constructor(3, []int{4, 5, 8, 2})
	assert(kl.Add(3) == 4)
	assert(kl.Add(5) == 5)
	assert(kl.Add(10) == 5)
	assert(kl.Add(9) == 8)
	assert(kl.Add(4) == 8)

	kl2 := Constructor(1, []int{})
	assert(kl2.Add(3) == 3)
	assert(kl2.Add(5) == 5)
	assert(kl2.Add(1) == 5)

	kl3 := Constructor(2, []int{1, 2})
	assert(kl3.Add(0) == 1)
	assert(kl3.Add(3) == 2)

	fmt.Println("all tests pass")
}

func main() { runTests() }
