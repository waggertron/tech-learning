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

func generateParenthesis(n int) []string {
	// TODO: implement
	return nil
}

func sorted(ss []string) []string {
	out := make([]string, len(ss))
	copy(out, ss)
	for i := 1; i < len(out); i++ {
		for j := i; j > 0 && out[j] < out[j-1]; j-- {
			out[j], out[j-1] = out[j-1], out[j]
		}
	}
	return out
}

func sliceEq(a, b []string) bool {
	if len(a) != len(b) {
		return false
	}
	for i := range a {
		if a[i] != b[i] {
			return false
		}
	}
	return true
}

func runTests() {
	assert(sliceEq(sorted(generateParenthesis(1)), []string{"()"}))
	assert(sliceEq(sorted(generateParenthesis(2)), sorted([]string{"(())", "()()"})))
	assert(sliceEq(sorted(generateParenthesis(3)), sorted([]string{"((()))", "(()())", "(())()", "()(())", "()()()"})))
	assert(len(generateParenthesis(4)) == 14)
	fmt.Println("all tests pass")
}

func main() { runTests() }
