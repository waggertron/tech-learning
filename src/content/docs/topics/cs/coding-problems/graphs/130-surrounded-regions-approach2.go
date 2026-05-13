package main

import "fmt"

func solve(board [][]byte) {
	if len(board) == 0 {
		return
	}
	rows, cols := len(board), len(board[0])

	var dfs func(r, c int)
	dfs = func(r, c int) {
		if r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] != 'O' {
			return
		}
		board[r][c] = 'T'
		dfs(r+1, c)
		dfs(r-1, c)
		dfs(r, c+1)
		dfs(r, c-1)
	}

	for c := 0; c < cols; c++ {
		dfs(0, c)
		dfs(rows-1, c)
	}
	for r := 0; r < rows; r++ {
		dfs(r, 0)
		dfs(r, cols-1)
	}

	for r := 0; r < rows; r++ {
		for c := 0; c < cols; c++ {
			if board[r][c] == 'O' {
				board[r][c] = 'X'
			} else if board[r][c] == 'T' {
				board[r][c] = 'O'
			}
		}
	}
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

func eqBoard(a, b [][]byte) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if len(a[i]) != len(b[i]) {
			return false
		}
		for j := range a[i] {
			if a[i][j] != b[i][j] {
				return false
			}
		}
	}
	return true
}

func runTests() {
	b1 := [][]byte{{'X', 'X', 'X', 'X'}, {'X', 'O', 'O', 'X'}, {'X', 'X', 'O', 'X'}, {'X', 'O', 'X', 'X'}}
	solve(b1)
	assert(eqBoard(b1, [][]byte{{'X', 'X', 'X', 'X'}, {'X', 'X', 'X', 'X'}, {'X', 'X', 'X', 'X'}, {'X', 'O', 'X', 'X'}}))

	b2 := [][]byte{{'X', 'X'}, {'X', 'X'}}
	solve(b2)
	assert(eqBoard(b2, [][]byte{{'X', 'X'}, {'X', 'X'}}))

	b3 := [][]byte{{'O'}}
	solve(b3)
	assert(eqBoard(b3, [][]byte{{'O'}}))

	b4 := [][]byte{{'X', 'X', 'X'}, {'X', 'O', 'X'}, {'X', 'X', 'X'}}
	solve(b4)
	assert(eqBoard(b4, [][]byte{{'X', 'X', 'X'}, {'X', 'X', 'X'}, {'X', 'X', 'X'}}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
