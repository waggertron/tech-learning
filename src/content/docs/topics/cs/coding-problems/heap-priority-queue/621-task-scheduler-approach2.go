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

func leastInterval(tasks []byte, n int) int {
	freq := make(map[byte]int)
	for _, t := range tasks {
		freq[t]++
	}

	h := &MaxHeap{}
	heap.Init(h)
	for _, c := range freq {
		heap.Push(h, c) // L1: O(t) build heap
	}

	// cooldown queue: [readyTime, remainingCount]
	type item struct{ readyTime, count int }
	cooldown := []item{}
	time := 0

	for h.Len() > 0 || len(cooldown) > 0 { // L2: T iterations total
		time++
		if h.Len() > 0 {
			c := heap.Pop(h).(int) - 1 // L3: O(log t) pop
			if c > 0 {
				cooldown = append(cooldown, item{time + n, c}) // L4: O(1) enqueue
			}
		}
		if len(cooldown) > 0 && cooldown[0].readyTime == time {
			heap.Push(h, cooldown[0].count) // L5: O(log t) push
			cooldown = cooldown[1:]
		}
	}
	return time
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
	assert(leastInterval([]byte{'A', 'A', 'A', 'B', 'B', 'B'}, 2) == 8)
	assert(leastInterval([]byte{'A', 'A', 'A', 'B', 'B', 'B'}, 0) == 6)
	assert(leastInterval([]byte{'A', 'A', 'A', 'A', 'A', 'A', 'B', 'C', 'D', 'E', 'F', 'G'}, 2) == 16)
	assert(leastInterval([]byte{'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D'}, 2) == 8)
	assert(leastInterval([]byte{'A', 'A', 'A'}, 3) == 9)
	assert(leastInterval([]byte{'A', 'A', 'A'}, 0) == 3)
	fmt.Println("all tests pass")
}

func main() { runTests() }
