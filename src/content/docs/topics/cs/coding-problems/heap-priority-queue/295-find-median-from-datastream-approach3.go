package main

import (
	"container/heap"
	"fmt"
)

// MaxHeap for the lower half
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

// MinHeap for the upper half
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

type MedianFinder struct {
	lo *MaxHeap // smaller half (max-heap)
	hi *MinHeap // larger half (min-heap)
}

func Constructor() MedianFinder {
	lo := &MaxHeap{}
	hi := &MinHeap{}
	heap.Init(lo)
	heap.Init(hi)
	return MedianFinder{lo: lo, hi: hi}
}

func (mf *MedianFinder) AddNum(num int) {
	heap.Push(mf.lo, num)                              // L1: O(log n) push to lo
	heap.Push(mf.hi, heap.Pop(mf.lo).(int))           // L2: O(log n) pop+push
	if mf.hi.Len() > mf.lo.Len() {
		heap.Push(mf.lo, heap.Pop(mf.hi).(int))       // L3: O(log n) rebalance
	}
}

func (mf *MedianFinder) FindMedian() float64 {
	if mf.lo.Len() > mf.hi.Len() {
		return float64((*mf.lo)[0]) // L4: O(1) read lo top
	}
	return float64((*mf.lo)[0]+(*mf.hi)[0]) / 2 // L5: O(1) average both tops
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
	mf := Constructor()
	mf.AddNum(1)
	mf.AddNum(2)
	assert(mf.FindMedian() == 1.5)
	mf.AddNum(3)
	assert(mf.FindMedian() == 2.0)

	mf2 := Constructor()
	mf2.AddNum(42)
	assert(mf2.FindMedian() == 42.0)

	mf3 := Constructor()
	for _, v := range []int{5, 3, 8, 1, 9} {
		mf3.AddNum(v)
	}
	assert(mf3.FindMedian() == 5.0)

	mf4 := Constructor()
	for _, v := range []int{2, 4, 6, 8} {
		mf4.AddNum(v)
	}
	assert(mf4.FindMedian() == 5.0)

	fmt.Println("all tests pass")
}

func main() { runTests() }
