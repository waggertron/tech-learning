package main

import (
	"fmt"
)

func networkDelayTime(times [][]int, n int, k int) int {
	const INF = 1<<31 - 1
	dist := make([][]int, n+1)
	for i := range dist {
		dist[i] = make([]int, n+1)
		for j := range dist[i] {
			if i == j {
				dist[i][j] = 0
			} else {
				dist[i][j] = INF
			}
		}
	}
	for _, t := range times {
		u, v, w := t[0], t[1], t[2]
		if w < dist[u][v] {
			dist[u][v] = w
		}
	}
	for mid := 1; mid <= n; mid++ {
		for i := 1; i <= n; i++ {
			for j := 1; j <= n; j++ {
				if dist[i][mid] != INF && dist[mid][j] != INF {
					if dist[i][mid]+dist[mid][j] < dist[i][j] {
						dist[i][j] = dist[i][mid] + dist[mid][j]
					}
				}
			}
		}
	}
	m := 0
	for j := 1; j <= n; j++ {
		if dist[k][j] == INF {
			return -1
		}
		if dist[k][j] > m {
			m = dist[k][j]
		}
	}
	return m
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
	assert(networkDelayTime([][]int{{2, 1, 1}, {2, 3, 1}, {3, 4, 1}}, 4, 2) == 2)
	assert(networkDelayTime([][]int{{1, 2, 1}}, 2, 1) == 1)
	assert(networkDelayTime([][]int{{1, 2, 1}}, 2, 2) == -1)
	assert(networkDelayTime([][]int{}, 1, 1) == 0)
	assert(networkDelayTime([][]int{{1, 2, 1}, {1, 2, 5}}, 2, 1) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
