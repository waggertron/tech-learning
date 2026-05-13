package main

import (
	"fmt"
	"sort"
	"strings"
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
	result := [][]string{}
	colsUsed := map[int]bool{}
	diag1 := map[int]bool{} // row + col
	diag2 := map[int]bool{} // row - col
	placement := make([]int, n)
	for i := range placement {
		placement[i] = -1
	}

	var backtrack func(r int)
	backtrack = func(r int) {
		if r == n {
			board := make([]string, n)
			for i := 0; i < n; i++ {
				row := strings.Repeat(".", n)
				rowBytes := []byte(row)
				rowBytes[placement[i]] = 'Q'
				board[i] = string(rowBytes) // L1: O(n^2) build board
			}
			result = append(result, board)
			return
		}
		for c := 0; c < n; c++ {
			if colsUsed[c] || diag1[r+c] || diag2[r-c] {
				continue // L2: O(1) conflict check
			}
			colsUsed[c] = true    // L3: O(1) mark column
			diag1[r+c] = true     // L4: O(1) mark anti-diag
			diag2[r-c] = true     // L5: O(1) mark main diag
			placement[r] = c
			backtrack(r + 1)      // L6: recurse to next row
			delete(colsUsed, c)   // L7: O(1) unmark
			delete(diag1, r+c)
			delete(diag2, r-c)
		}
	}

	backtrack(0)
	return result
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
