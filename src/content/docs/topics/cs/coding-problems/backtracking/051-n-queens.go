package main

import (
	"fmt"
	"sort"
)

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func solveNQueens(n int) [][]string {
	// TODO: implement
	return nil
}

func boards2DEqual(a, b [][]string) bool {
	if len(a) != len(b) {
		return false
	}
	sortBoards := func(boards [][]string) {
		sort.Slice(boards, func(i, j int) bool {
			return fmt.Sprint(boards[i]) < fmt.Sprint(boards[j])
		})
	}
	sortBoards(a)
	sortBoards(b)
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
	r1 := solveNQueens(1)
	assert(boards2DEqual(r1, [][]string{{"Q"}}), "solveNQueens(1) failed")

	r4 := solveNQueens(4)
	assert(len(r4) == 2, "solveNQueens(4) should have 2 solutions")
	assert(boards2DEqual(r4, [][]string{
		{".Q..", "...Q", "Q...", "..Q."},
		{"..Q.", "Q...", "...Q", ".Q.."},
	}), "solveNQueens(4) solutions incorrect")

	r5 := solveNQueens(5)
	assert(len(r5) == 10, "solveNQueens(5) should have 10 solutions")

	r2 := solveNQueens(2)
	assert(len(r2) == 0, "solveNQueens(2) should have no solutions")

	r3 := solveNQueens(3)
	assert(len(r3) == 0, "solveNQueens(3) should have no solutions")

	fmt.Println("all tests pass")
}

func main() { runTests() }
