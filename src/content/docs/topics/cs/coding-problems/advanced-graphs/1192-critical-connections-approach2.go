package main

import (
	"fmt"
	"reflect"
)

func criticalConnections(n int, connections [][]int) [][]int {
	graph := make([][]int, n)
	for _, c := range connections {
		u, v := c[0], c[1]
		graph[u] = append(graph[u], v)
		graph[v] = append(graph[v], u)
	}

	disc := make([]int, n)
	low := make([]int, n)
	for i := range disc {
		disc[i] = -1
	}
	var bridges [][]int
	timer := 0

	var dfs func(node, parent int)
	dfs = func(node, parent int) {
		disc[node] = timer
		low[node] = timer
		timer++
		for _, neighbor := range graph[node] {
			if neighbor == parent {
				continue
			}
			if disc[neighbor] == -1 {
				dfs(neighbor, node)
				if low[neighbor] < low[node] {
					low[node] = low[neighbor]
				}
				if low[neighbor] > disc[node] {
					bridges = append(bridges, []int{node, neighbor})
				}
			} else {
				if disc[neighbor] < low[node] {
					low[node] = disc[neighbor]
				}
			}
		}
	}

	for i := 0; i < n; i++ {
		if disc[i] == -1 {
			dfs(i, -1)
		}
	}
	return bridges
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
	assert(reflect.DeepEqual(criticalConnections(4, [][]int{{0, 1}, {1, 2}, {2, 0}, {1, 3}}), [][]int{{1, 3}}))
	assert(reflect.DeepEqual(criticalConnections(2, [][]int{{0, 1}}), [][]int{{0, 1}}))
	result := criticalConnections(3, [][]int{{0, 1}, {1, 2}, {0, 2}})
	assert(len(result) == 0)
	fmt.Println("all tests pass")
}

func main() { runTests() }
