package main

import "fmt"

func abs1584a(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func minCostConnectPoints(points [][]int) int {
	n := len(points)
	inMst := make([]bool, n)
	minDist := make([]int, n)
	for i := range minDist {
		minDist[i] = 1<<31 - 1
	}
	minDist[0] = 0
	total := 0

	for range points {
		u := -1
		for v := 0; v < n; v++ {
			if !inMst[v] && (u == -1 || minDist[v] < minDist[u]) {
				u = v
			}
		}
		inMst[u] = true
		total += minDist[u]
		for v := 0; v < n; v++ {
			if !inMst[v] {
				d := abs1584a(points[u][0]-points[v][0]) + abs1584a(points[u][1]-points[v][1])
				if d < minDist[v] {
					minDist[v] = d
				}
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
