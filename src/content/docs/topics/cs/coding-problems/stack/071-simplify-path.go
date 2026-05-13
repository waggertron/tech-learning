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

func simplifyPath(path string) string {
	// TODO: implement
	return ""
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
