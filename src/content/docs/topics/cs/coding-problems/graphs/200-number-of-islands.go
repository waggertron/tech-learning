package main

import "fmt"

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func numIslands(grid [][]byte) int {
	// TODO: implement
	return 0
}

func runTests() {
	g1 := [][]byte{
		{'1', '1', '1', '1', '0'},
		{'1', '1', '0', '1', '0'},
		{'1', '1', '0', '0', '0'},
		{'0', '0', '0', '0', '0'},
	}
	assert(numIslands(g1) == 1)
	g2 := [][]byte{
		{'1', '1', '0', '0', '0'},
		{'1', '1', '0', '0', '0'},
		{'0', '0', '1', '0', '0'},
		{'0', '0', '0', '1', '1'},
	}
	assert(numIslands(g2) == 3)
	assert(numIslands([][]byte{}) == 0)
	assert(numIslands([][]byte{{'1'}}) == 1)
	assert(numIslands([][]byte{{'0'}}) == 0)
	assert(numIslands([][]byte{{'1', '1'}, {'1', '1'}}) == 1)
	fmt.Println("all tests pass")
}

func main() { runTests() }
