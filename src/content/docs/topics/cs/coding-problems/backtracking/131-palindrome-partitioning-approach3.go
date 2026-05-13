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

func partition(s string) [][]string {
	n := len(s)
	// isPal[i][j] = true iff s[i:j+1] is a palindrome
	isPal := make([][]bool, n)
	for i := range isPal {
		isPal[i] = make([]bool, n)
		isPal[i][i] = true // L1: single chars are palindromes
	}
	for length := 2; length <= n; length++ {
		for i := 0; i <= n-length; i++ {
			j := i + length - 1
			if s[i] == s[j] && (length == 2 || isPal[i+1][j-1]) {
				isPal[i][j] = true // L2: O(1) DP recurrence
			}
		}
	}

	result := [][]string{}
	path := []string{}

	var backtrack func(start int)
	backtrack = func(start int) {
		if start == n {
			cp := make([]string, len(path))
			copy(cp, path)
			result = append(result, cp) // L3: O(n) copy
			return
		}
		for end := start; end < n; end++ {
			if isPal[start][end] {              // L4: O(1) table lookup
				path = append(path, s[start:end+1]) // L5: O(k) slice for result
				backtrack(end + 1)                   // L6: recurse
				path = path[:len(path)-1]
			}
		}
	}

	backtrack(0)
	return result
}

func strSlices2DEqual(a, b [][]string) bool {
	if len(a) != len(b) {
		return false
	}
	sort.Slice(a, func(i, j int) bool { return fmt.Sprint(a[i]) < fmt.Sprint(a[j]) })
	sort.Slice(b, func(i, j int) bool { return fmt.Sprint(b[i]) < fmt.Sprint(b[j]) })
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
	r := partition("aab")
	assert(strSlices2DEqual(r, [][]string{{"a", "a", "b"}, {"aa", "b"}}), "partition(\"aab\") failed")

	r2 := partition("a")
	assert(strSlices2DEqual(r2, [][]string{{"a"}}), "partition(\"a\") failed")

	r3 := partition("aaa")
	assert(strSlices2DEqual(r3, [][]string{{"a", "a", "a"}, {"a", "aa"}, {"aa", "a"}, {"aaa"}}), "partition(\"aaa\") failed")

	r4 := partition("abc")
	assert(strSlices2DEqual(r4, [][]string{{"a", "b", "c"}}), "partition(\"abc\") failed")

	fmt.Println("all tests pass")
}

func main() { runTests() }
