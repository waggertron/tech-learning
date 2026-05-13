package main

import (
	"fmt"
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

type frame struct {
	count  int
	prefix string
}

func decodeString(s string) string {
	stack := []frame{}
	currentString := ""
	currentCount := 0

	for _, ch := range s {
		switch {
		case ch >= '0' && ch <= '9':
			currentCount = currentCount*10 + int(ch-'0')
		case ch == '[':
			stack = append(stack, frame{currentCount, currentString})
			currentCount = 0
			currentString = ""
		case ch == ']':
			top := stack[len(stack)-1]
			stack = stack[:len(stack)-1]
			currentString = top.prefix + strings.Repeat(currentString, top.count)
		default:
			currentString += string(ch)
		}
	}
	return currentString
}

func runTests() {
	assert(decodeString("3[a]2[bc]") == "aaabcbc")
	assert(decodeString("3[a2[c]]") == "accaccacc")
	assert(decodeString("2[abc]3[cd]ef") == "abcabccdcdcdef")
	fmt.Println("all tests pass")
}

func main() { runTests() }
