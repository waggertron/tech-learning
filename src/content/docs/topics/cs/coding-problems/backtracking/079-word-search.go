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

func exist(board [][]byte, word string) bool {
	// TODO: implement
	return false
}

func copyBoard(board [][]byte) [][]byte {
	cp := make([][]byte, len(board))
	for i, row := range board {
		cp[i] = make([]byte, len(row))
		copy(cp[i], row)
	}
	return cp
}

func runTests() {
	board := [][]byte{
		{'A', 'B', 'C', 'E'},
		{'S', 'F', 'C', 'S'},
		{'A', 'D', 'E', 'E'},
	}
	assert(exist(copyBoard(board), "ABCCED") == true, "ABCCED should exist")
	assert(exist(copyBoard(board), "SEE") == true, "SEE should exist")
	assert(exist(copyBoard(board), "ABCB") == false, "ABCB should not exist")
	assert(exist([][]byte{{'A'}}, "A") == true, "single A should exist")
	assert(exist([][]byte{{'A'}}, "B") == false, "single A board, B should not exist")

	fmt.Println("all tests pass")
}

func main() { runTests() }
