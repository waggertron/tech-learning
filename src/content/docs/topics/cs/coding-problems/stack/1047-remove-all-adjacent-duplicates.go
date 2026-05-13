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
	// TODO: implement
	return ""
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
