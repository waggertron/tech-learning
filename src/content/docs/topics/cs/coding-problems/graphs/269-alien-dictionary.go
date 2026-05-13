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

func alienOrder(words []string) string {
	// TODO: implement
	return ""
}

func containsAll(s, chars string) bool {
	for _, c := range chars {
		found := false
		for _, sc := range s {
			if sc == c {
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}
	return true
}

func runTests() {
	r1 := alienOrder([]string{"wrt", "wrf", "er", "ett", "rftt"})
	assert(r1 == "wertf", fmt.Sprintf("got %q", r1))
	r2 := alienOrder([]string{"z", "x"})
	assert(r2 == "zx", fmt.Sprintf("got %q", r2))
	assert(alienOrder([]string{"z", "x", "z"}) == "")
	assert(alienOrder([]string{"abc", "ab"}) == "")
	r3 := alienOrder([]string{"abc"})
	assert(containsAll(r3, "abc") && len(r3) == 3, fmt.Sprintf("got %q", r3))
	fmt.Println("all tests pass")
}

func main() { runTests() }
