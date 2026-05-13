package main

import "fmt"

func canFinish(numCourses int, prerequisites [][]int) bool {
	graph := make([][]int, numCourses)
	for i := range graph {
		graph[i] = []int{}
	}
	for _, p := range prerequisites {
		graph[p[1]] = append(graph[p[1]], p[0])
	}

	const (
		white = 0
		gray  = 1
		black = 2
	)
	color := make([]int, numCourses)

	var dfs func(n int) bool
	dfs = func(n int) bool {
		if color[n] == gray {
			return false
		}
		if color[n] == black {
			return true
		}
		color[n] = gray
		for _, nb := range graph[n] {
			if !dfs(nb) {
				return false
			}
		}
		color[n] = black
		return true
	}

	for c := 0; c < numCourses; c++ {
		if !dfs(c) {
			return false
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
	assert(canFinish(2, [][]int{{1, 0}}) == true)
	assert(canFinish(2, [][]int{{1, 0}, {0, 1}}) == false)
	assert(canFinish(5, [][]int{}) == true)
	assert(canFinish(1, [][]int{}) == true)
	assert(canFinish(3, [][]int{{1, 0}, {2, 1}, {0, 2}}) == false)
	assert(canFinish(4, [][]int{{1, 0}, {2, 0}, {3, 1}, {3, 2}}) == true)
	fmt.Println("all tests pass")
}

func main() { runTests() }
