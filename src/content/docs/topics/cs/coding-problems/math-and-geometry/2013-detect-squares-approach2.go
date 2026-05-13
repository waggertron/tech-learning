package main

import "fmt"

type DetectSquares struct {
	counts map[[2]int]int  // L1: O(1)
	points [][2]int        // L2: O(1), distinct points for iteration
	seen   map[[2]int]bool
}

func Constructor() DetectSquares {
	return DetectSquares{
		counts: make(map[[2]int]int),
		seen:   make(map[[2]int]bool),
	}
}

func (ds *DetectSquares) Add(point []int) {
	p := [2]int{point[0], point[1]}
	ds.counts[p]++                              // L3: O(1) amortized
	if !ds.seen[p] {
		ds.seen[p] = true
		ds.points = append(ds.points, p)        // L4: O(1) amortized
	}
}

func (ds *DetectSquares) Count(point []int) int {
	qx, qy := point[0], point[1]
	total := 0
	for _, p := range ds.points {              // L5: iterate all distinct points, O(n)
		x, y := p[0], p[1]
		dx := x - qx
		dy := y - qy
		if dx < 0 { dx = -dx }
		if dy < 0 { dy = -dy }
		if dx == dy && x != qx && y != qy {    // L6: O(1)
			total += ds.counts[[2]int{x, y}] *
				ds.counts[[2]int{x, qy}] *
				ds.counts[[2]int{qx, y}]       // L7: O(1)
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
	d := Constructor()
	d.Add([]int{3, 10})
	d.Add([]int{11, 2})
	d.Add([]int{3, 2})
	assert(d.Count([]int{11, 10}) == 1)
	assert(d.Count([]int{14, 8}) == 0)
	d.Add([]int{11, 2})
	assert(d.Count([]int{11, 10}) == 2)
	d2 := Constructor()
	assert(d2.Count([]int{0, 0}) == 0)
	d3 := Constructor()
	d3.Add([]int{0, 0})
	d3.Add([]int{2, 0})
	d3.Add([]int{0, 2})
	d3.Add([]int{2, 2})
	assert(d3.Count([]int{0, 0}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
