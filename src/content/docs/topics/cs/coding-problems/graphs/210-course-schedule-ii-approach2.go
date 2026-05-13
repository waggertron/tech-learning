package main

import "fmt"

func findOrder(numCourses int, prerequisites [][]int) []int {
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
	order := []int{}
	hasCycle := false

	var dfs func(n int)
	dfs = func(n int) {
		if hasCycle {
			return
		}
		color[n] = gray
		for _, nb := range graph[n] {
			if color[nb] == white {
				dfs(nb)
			} else if color[nb] == gray {
				hasCycle = true
				return
			}
		}
		color[n] = black
		order = append(order, n)
	}

	for c := 0; c < numCourses; c++ {
		if color[c] == white {
			dfs(c)
		}
	}

	if hasCycle {
		return []int{}
	}
	// reverse order
	for i, j := 0, len(order)-1; i < j; i, j = i+1, j-1 {
		order[i], order[j] = order[j], order[i]
	}
	return order
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

func indexOf(slice []int, val int) int {
	for i, v := range slice {
		if v == val {
			return i
		}
	}
	return -1
}

func runTests() {
	r1 := findOrder(2, [][]int{{1, 0}})
	assert(len(r1) == 2 && r1[0] == 0 && r1[1] == 1)

	r2 := findOrder(4, [][]int{{1, 0}, {2, 0}, {3, 1}, {3, 2}})
	assert(indexOf(r2, 0) < indexOf(r2, 1))
	assert(indexOf(r2, 0) < indexOf(r2, 2))
	assert(indexOf(r2, 1) < indexOf(r2, 3))
	assert(indexOf(r2, 2) < indexOf(r2, 3))

	assert(len(findOrder(2, [][]int{{1, 0}, {0, 1}})) == 0)
	r3 := findOrder(1, [][]int{})
	assert(len(r3) == 1 && r3[0] == 0)
	assert(len(findOrder(3, [][]int{{0, 1}, {1, 2}, {2, 0}})) == 0)
	fmt.Println("all tests pass")
}

func main() { runTests() }
