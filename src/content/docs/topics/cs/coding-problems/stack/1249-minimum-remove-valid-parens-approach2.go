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
	stack := []int{}    // indices of unmatched '('
	remove := map[int]bool{}

	for i, ch := range s {
		if ch == '(' {
			stack = append(stack, i)
		} else if ch == ')' {
			if len(stack) > 0 {
				stack = stack[:len(stack)-1]
			} else {
				remove[i] = true
			}
		}
	}
	for _, i := range stack {
		remove[i] = true
	}

	result := []byte{}
	for i := 0; i < len(s); i++ {
		if !remove[i] {
			result = append(result, s[i])
		}
	}
	return string(result)
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
