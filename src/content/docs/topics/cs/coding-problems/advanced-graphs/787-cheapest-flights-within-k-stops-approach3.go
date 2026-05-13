package main

import "fmt"

func findCheapestPrice(n int, flights [][]int, src int, dst int, k int) int {
	const INF = 1<<31 - 1
	dist := make([]int, n)
	for i := range dist {
		dist[i] = INF
	}
	dist[src] = 0

	for i := 0; i <= k; i++ {
		newDist := make([]int, n)
		copy(newDist, dist)
		for _, f := range flights {
			u, v, w := f[0], f[1], f[2]
			if dist[u] != INF && dist[u]+w < newDist[v] {
				newDist[v] = dist[u] + w
			}
		}
		dist = newDist
	}
	if dist[dst] == INF {
		return -1
	}
	return dist[dst]
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
	flights := [][]int{{0, 1, 100}, {1, 2, 100}, {2, 0, 100}, {1, 3, 600}, {2, 3, 200}}
	assert(findCheapestPrice(4, flights, 0, 3, 1) == 700)
	assert(findCheapestPrice(4, flights, 0, 3, 0) == -1)
	assert(findCheapestPrice(4, flights, 0, 3, 2) == 400)
	assert(findCheapestPrice(2, [][]int{{0, 1, 500}}, 0, 1, 0) == 500)
	assert(findCheapestPrice(3, [][]int{{0, 1, 100}, {1, 2, 50}}, 1, 1, 1) == 0)
	assert(findCheapestPrice(3, [][]int{{0, 1, 100}}, 0, 2, 5) == -1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
