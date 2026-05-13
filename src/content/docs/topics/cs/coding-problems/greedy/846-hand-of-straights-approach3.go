package main

import (
	"container/heap"
	"fmt"
)

type minHeap []int

func (h minHeap) Len() int            { return len(h) }
func (h minHeap) Less(i, j int) bool  { return h[i] < h[j] }
func (h minHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *minHeap) Push(x interface{}) { *h = append(*h, x.(int)) }
func (h *minHeap) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func isNStraightHandHeap(hand []int, groupSize int) bool {
	if len(hand)%groupSize != 0 {
		return false
	}
	counts := make(map[int]int)
	for _, v := range hand {
		counts[v]++
	}
	h := &minHeap{}
	for k := range counts {
		heap.Push(h, k)
	}
	for h.Len() > 0 {
		x := (*h)[0]
		if counts[x] == 0 {
			heap.Pop(h)
			continue
		}
		for k := 0; k < groupSize; k++ {
			if counts[x+k] == 0 {
				return false
			}
			counts[x+k]--
		}
		for h.Len() > 0 && counts[(*h)[0]] == 0 {
			heap.Pop(h)
		}
	}
	return true
}

func main() {
	assert := func(condition bool) {
		if !condition {
			panic("assertion failed")
		}
	}
	assert(isNStraightHandHeap([]int{1, 2, 3, 6, 2, 3, 4, 7, 8}, 3) == true)
	assert(isNStraightHandHeap([]int{1, 2, 3, 4, 5}, 4) == false)
	assert(isNStraightHandHeap([]int{1}, 1) == true)
	assert(isNStraightHandHeap([]int{1, 2, 3}, 3) == true)
	assert(isNStraightHandHeap([]int{1, 2, 4}, 3) == false)
	assert(isNStraightHandHeap([]int{1, 1, 2, 2, 3, 3}, 3) == true)
	fmt.Println("all tests pass")
}
