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

func simplifyPath(path string) string {
	parts := strings.Split(path, "/")
	stack := []string{}
	for _, part := range parts {
		if part == "" || part == "." {
			continue
		} else if part == ".." {
			if len(stack) > 0 {
				stack = stack[:len(stack)-1]
			}
		} else {
			stack = append(stack, part)
		}
	}
	return "/" + strings.Join(stack, "/")
}

func runTests() {
	assert(simplifyPath("/home/") == "/home")
	assert(simplifyPath("/home//foo/") == "/home/foo")
	assert(simplifyPath("/home/user/Documents/../Pictures") == "/home/user/Pictures")
	assert(simplifyPath("/../") == "/")
	assert(simplifyPath("/a/./b/../../c/") == "/c")
	assert(simplifyPath("/") == "/")
	fmt.Println("all tests pass")
}

func main() { runTests() }
