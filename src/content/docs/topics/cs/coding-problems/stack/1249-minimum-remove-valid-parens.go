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

func minRemoveToMakeValid(s string) string {
	// TODO: implement
	return ""
}

func isValid(t string) bool {
	count := 0
	for _, ch := range t {
		if ch == '(' {
			count++
		} else if ch == ')' {
			if count == 0 {
				return false
			}
			count--
		}
	}
	return count == 0
}

func runTests() {
	r := minRemoveToMakeValid("lee(t(c)o)de)")
	assert(isValid(r) && len(r) == 13)
	r = minRemoveToMakeValid("a)b(c)d")
	assert(isValid(r) && len(r) == 6)
	assert(minRemoveToMakeValid("))((") == "")
	r = minRemoveToMakeValid("(a(b(c)d)")
	assert(isValid(r))
	fmt.Println("all tests pass")
}

func main() { runTests() }
