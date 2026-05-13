package main

import (
	"fmt"
	"sort"
)

func abs1584(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func minCostConnectPoints(points [][]int) int {
	n := len(points)
	type Edge struct{ d, i, j int }
	edges := make([]Edge, 0, n*(n-1)/2)
	for i := 0; i < n; i++ {
		for j := i + 1; j < n; j++ {
			d := abs1584(points[i][0]-points[j][0]) + abs1584(points[i][1]-points[j][1])
			edges = append(edges, Edge{d, i, j})
		}
	}
	sort.Slice(edges, func(a, b int) bool { return edges[a].d < edges[b].d })

	parent := make([]int, n)
	for i := range parent {
		parent[i] = i
	}
	var find func(int) int
	find = func(x int) int {
		for parent[x] != x {
			parent[x] = parent[parent[x]]
			x = parent[x]
		}
		return x
	}

	total, added := 0, 0
	for _, e := range edges {
		ri, rj := find(e.i), find(e.j)
		if ri != rj {
			parent[ri] = rj
			total += e.d
			added++
			if added == n-1 {
				break
			}
		}
	}
	return total
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
	assert(minCostConnectPoints([][]int{{0, 0}, {2, 2}, {3, 10}, {5, 2}, {7, 0}}) == 20)
	assert(minCostConnectPoints([][]int{{3, 12}, {-2, 5}, {-4, 1}}) == 18)
	assert(minCostConnectPoints([][]int{{0, 0}}) == 0)
	assert(minCostConnectPoints([][]int{{0, 0}, {1, 1}}) == 2)
	assert(minCostConnectPoints([][]int{{0, 0}, {1, 0}, {2, 0}, {3, 0}}) == 3)
	fmt.Println("all tests pass")
}

func main() { runTests() }
