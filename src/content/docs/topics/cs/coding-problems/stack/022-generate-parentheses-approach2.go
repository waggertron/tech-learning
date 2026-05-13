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
	result := []string{}
	var rec func(s string, opens, closes int)
	rec = func(s string, opens, closes int) {
		if opens > n || closes > opens {
			return
		}
		if len(s) == 2*n {
			result = append(result, s)
			return
		}
		rec(s+"(", opens+1, closes)
		rec(s+")", opens, closes+1)
	}
	rec("", 0, 0)
	return result
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
