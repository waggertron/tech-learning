package main

import (
	"fmt"
	"sort"
)

type Cell778 struct {
	v, r, c int
}

func swimInWater(grid [][]int) int {
	n := len(grid)
	cells := make([]Cell778, 0, n*n)
	for r := 0; r < n; r++ {
		for c := 0; c < n; c++ {
			cells = append(cells, Cell778{v: grid[r][c], r: r, c: c})
		}
	}
	sort.Slice(cells, func(i, j int) bool { return cells[i].v < cells[j].v })

	parent := make([]int, n*n)
	for i := range parent {
		parent[i] = i
	}
	active := make([]bool, n*n)

	var find func(int) int
	find = func(x int) int {
		for parent[x] != x {
			parent[x] = parent[parent[x]]
			x = parent[x]
		}
		return x
	}
	union := func(a, b int) {
		ra, rb := find(a), find(b)
		if ra != rb {
			parent[ra] = rb
		}
	}

	dirs := [][2]int{{1, 0}, {-1, 0}, {0, 1}, {0, -1}}
	for _, cell := range cells {
		idx := cell.r*n + cell.c
		active[idx] = true
		for _, d := range dirs {
			nr, nc := cell.r+d[0], cell.c+d[1]
			if nr >= 0 && nr < n && nc >= 0 && nc < n && active[nr*n+nc] {
				union(idx, nr*n+nc)
			}
		}
		if find(0) == find(n*n-1) {
			return cell.v
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
