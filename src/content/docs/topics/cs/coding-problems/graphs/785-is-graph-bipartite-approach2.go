package main

import "fmt"

func isBipartite(graph [][]int) bool {
	n := len(graph)
	color := make([]int, n)
	for i := range color {
		color[i] = -1
	}

	for start := 0; start < n; start++ {
		if color[start] != -1 {
			continue
		}
		color[start] = 0
		queue := []int{start}
		for len(queue) > 0 {
			node := queue[0]
			queue = queue[1:]
			for _, neighbor := range graph[node] {
				if color[neighbor] == -1 {
					color[neighbor] = 1 - color[node]
					queue = append(queue, neighbor)
				} else if color[neighbor] == color[node] {
					return false
				}
			}
		}
	}
	return true
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
	assert(isBipartite([][]int{{1, 2, 3}, {0, 2}, {0, 1, 3}, {0, 2}}) == false)
	assert(isBipartite([][]int{{1, 3}, {0, 2}, {1, 3}, {0, 2}}) == true)
	assert(isBipartite([][]int{{}}) == true)
	assert(isBipartite([][]int{{1}, {0}}) == true)
	assert(isBipartite([][]int{{1, 2}, {0, 2}, {0, 1}}) == false)
	assert(isBipartite([][]int{{1}, {0}, {3}, {2}}) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
