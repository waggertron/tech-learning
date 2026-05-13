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
	rows := len(board)
	cols := len(board[0])

	var dfs func(r, c, i int) bool
	dfs = func(r, c, i int) bool {
		if i == len(word) {
			return true // L1: full match
		}
		if r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] != word[i] {
			return false // L2: boundary / mismatch
		}
		saved := board[r][c]
		board[r][c] = '#'                                              // L3: O(1) mark in-place
		found := dfs(r+1, c, i+1) || dfs(r-1, c, i+1) ||
			dfs(r, c+1, i+1) || dfs(r, c-1, i+1)                     // L4: 4 recursive calls
		board[r][c] = saved                                            // L5: O(1) restore
		return found
	}

	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			if dfs(r, c, 0) {
				return true
			}
		}
	}
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
