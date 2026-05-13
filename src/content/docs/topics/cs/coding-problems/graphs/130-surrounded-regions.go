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

func solve(board [][]byte) {
	// TODO: implement
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
