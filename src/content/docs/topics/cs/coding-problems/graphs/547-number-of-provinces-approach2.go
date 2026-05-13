package main

import "fmt"

func findCircleNum(isConnected [][]int) int {
	n := len(isConnected)
	visited := make([]bool, n)
	provinces := 0

	var dfs func(city int)
	dfs = func(city int) {
		visited[city] = true
		for neighbor := 0; neighbor < n; neighbor++ {
			if isConnected[city][neighbor] == 1 && !visited[neighbor] {
				dfs(neighbor)
			}
		}
	}

	for city := 0; city < n; city++ {
		if !visited[city] {
			provinces++
			dfs(city)
		}
	}
	return provinces
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
	assert(findCircleNum([][]int{{1, 1, 0}, {1, 1, 0}, {0, 0, 1}}) == 2)
	assert(findCircleNum([][]int{{1, 0, 0}, {0, 1, 0}, {0, 0, 1}}) == 3)
	assert(findCircleNum([][]int{{1, 1, 1}, {1, 1, 1}, {1, 1, 1}}) == 1)
	assert(findCircleNum([][]int{{1}}) == 1)
	assert(findCircleNum([][]int{{1, 1, 0}, {1, 1, 1}, {0, 1, 1}}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
