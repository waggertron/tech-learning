package main

import "fmt"

func possibleBipartition(n int, dislikes [][]int) bool {
	graph := make([][]int, n+1)
	for i := range graph {
		graph[i] = []int{}
	}
	for _, d := range dislikes {
		graph[d[0]] = append(graph[d[0]], d[1])
		graph[d[1]] = append(graph[d[1]], d[0])
	}

	color := make(map[int]int)

	for start := 1; start <= n; start++ {
		if _, ok := color[start]; ok {
			continue
		}
		color[start] = 0
		queue := []int{start}
		for len(queue) > 0 {
			person := queue[0]
			queue = queue[1:]
			for _, neighbor := range graph[person] {
				if _, ok := color[neighbor]; !ok {
					color[neighbor] = 1 - color[person]
					queue = append(queue, neighbor)
				} else if color[neighbor] == color[person] {
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
	assert(possibleBipartition(4, [][]int{{1, 2}, {1, 3}, {2, 4}}) == true)
	assert(possibleBipartition(3, [][]int{{1, 2}, {1, 3}, {2, 3}}) == false)
	assert(possibleBipartition(5, [][]int{{1, 2}, {2, 3}, {3, 4}, {4, 5}, {1, 5}}) == false)
	assert(possibleBipartition(4, [][]int{}) == true)
	assert(possibleBipartition(4, [][]int{{1, 2}, {3, 4}}) == true)
	assert(possibleBipartition(1, [][]int{}) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
