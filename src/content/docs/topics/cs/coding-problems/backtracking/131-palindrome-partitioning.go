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
	// TODO: implement
	return nil
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
