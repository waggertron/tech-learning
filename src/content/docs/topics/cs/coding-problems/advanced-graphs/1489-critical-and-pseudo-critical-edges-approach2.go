package main

import (
	"fmt"
	"reflect"
	"sort"
)

type UF1489 struct {
	parent, rank []int
}

func newUF1489(n int) *UF1489 {
	uf := &UF1489{parent: make([]int, n), rank: make([]int, n)}
	for i := range uf.parent {
		uf.parent[i] = i
	}
	return uf
}

func (uf *UF1489) find(x int) int {
	for uf.parent[x] != x {
		uf.parent[x] = uf.parent[uf.parent[x]]
		x = uf.parent[x]
	}
	return x
}

func (uf *UF1489) union(x, y int) bool {
	rx, ry := uf.find(x), uf.find(y)
	if rx == ry {
		return false
	}
	if uf.rank[rx] < uf.rank[ry] {
		rx, ry = ry, rx
	}
	uf.parent[ry] = rx
	if uf.rank[rx] == uf.rank[ry] {
		uf.rank[rx]++
	}
	return true
}

func findCriticalAndPseudoCriticalEdges(n int, edges [][]int) [][]int {
	type IndexedEdge struct{ w, u, v, orig int }
	indexed := make([]IndexedEdge, len(edges))
	for i, e := range edges {
		indexed[i] = IndexedEdge{w: e[2], u: e[0], v: e[1], orig: i}
	}
	sort.Slice(indexed, func(i, j int) bool { return indexed[i].w < indexed[j].w })

	kruskal := func(skip, force int) int {
		uf := newUF1489(n)
		weight, count := 0, 0
		if force != -1 {
			e := indexed[force]
			uf.union(e.u, e.v)
			weight += e.w
			count++
		}
		for idx, e := range indexed {
			if idx == skip {
				continue
			}
			if uf.union(e.u, e.v) {
				weight += e.w
				count++
			}
		}
		if count < n-1 {
			return 1<<31 - 1
		}
		return weight
	}

	base := kruskal(-1, -1)
	var critical, pseudo []int
	for i, e := range indexed {
		if kruskal(i, -1) > base {
			critical = append(critical, e.orig)
		} else if kruskal(-1, i) == base {
			pseudo = append(pseudo, e.orig)
		}
	}
	sort.Ints(critical)
	sort.Ints(pseudo)
	if critical == nil {
		critical = []int{}
	}
	if pseudo == nil {
		pseudo = []int{}
	}
	return [][]int{critical, pseudo}
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
	assert(reflect.DeepEqual(
		findCriticalAndPseudoCriticalEdges(5, [][]int{{0, 1, 1}, {1, 2, 1}, {2, 3, 2}, {0, 3, 2}, {0, 4, 3}, {3, 4, 3}, {1, 4, 6}}),
		[][]int{{0, 1}, {2, 3, 4, 5}},
	))
	assert(reflect.DeepEqual(
		findCriticalAndPseudoCriticalEdges(4, [][]int{{0, 1, 1}, {1, 2, 1}, {2, 3, 1}, {0, 3, 1}}),
		[][]int{{}, {0, 1, 2, 3}},
	))
	assert(reflect.DeepEqual(
		findCriticalAndPseudoCriticalEdges(2, [][]int{{0, 1, 5}}),
		[][]int{{0}, {}},
	))
	fmt.Println("all tests pass")
}

func main() { runTests() }
