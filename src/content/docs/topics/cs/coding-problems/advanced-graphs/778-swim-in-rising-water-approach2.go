package main

import (
	"container/heap"
	"fmt"
)

type Item778 struct {
	t, r, c int
}

type MinHeap778 []Item778

func (h MinHeap778) Len() int            { return len(h) }
func (h MinHeap778) Less(i, j int) bool  { return h[i].t < h[j].t }
func (h MinHeap778) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *MinHeap778) Push(x interface{}) { *h = append(*h, x.(Item778)) }
func (h *MinHeap778) Pop() interface{} {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

func swimInWater(grid [][]int) int {
	n := len(grid)
	h := &MinHeap778{{t: grid[0][0], r: 0, c: 0}}
	heap.Init(h)
	visited := make([][]bool, n)
	for i := range visited {
		visited[i] = make([]bool, n)
	}
	dirs := [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
	for h.Len() > 0 {
		item := heap.Pop(h).(Item778)
		t, r, c := item.t, item.r, item.c
		if visited[r][c] {
			continue
		}
		visited[r][c] = true
		if r == n-1 && c == n-1 {
			return t
		}
		for _, d := range dirs {
			nr, nc := r+d[0], c+d[1]
			if nr >= 0 && nr < n && nc >= 0 && nc < n && !visited[nr][nc] {
				next := grid[nr][nc]
				if t > next {
					next = t
				}
				heap.Push(h, Item778{t: next, r: nr, c: nc})
			}
		}
	}
	return -1
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
	assert(swimInWater([][]int{{0, 2}, {1, 3}}) == 3)
	assert(swimInWater([][]int{
		{0, 1, 2, 3, 4},
		{24, 23, 22, 21, 5},
		{12, 13, 14, 15, 16},
		{11, 17, 18, 19, 20},
		{10, 9, 8, 7, 6},
	}) == 16)
	assert(swimInWater([][]int{{0}}) == 0)
	assert(swimInWater([][]int{{7}}) == 7)
	assert(swimInWater([][]int{{0, 1}, {3, 2}}) == 2)
	fmt.Println("all tests pass")
}

func main() { runTests() }
