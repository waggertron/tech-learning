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

func removeDuplicates(s string) string {
	stack := []byte{}
	for i := 0; i < len(s); i++ {
		ch := s[i]
		if len(stack) > 0 && stack[len(stack)-1] == ch {
			stack = stack[:len(stack)-1]
		} else {
			stack = append(stack, ch)
		}
	}
	return string(stack)
}

func runTests() {
	assert(removeDuplicates("abbaca") == "ca")
	assert(removeDuplicates("azxxzy") == "ay")
	assert(removeDuplicates("a") == "a")
	assert(removeDuplicates("aa") == "")
	assert(removeDuplicates("abcd") == "abcd")
	fmt.Println("all tests pass")
}

func main() { runTests() }
