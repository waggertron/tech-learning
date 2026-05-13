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

func encode(strs []string) string {
	// TODO: implement
	return ""
}

func decode(s string) []string {
	// TODO: implement
	return nil
}

func strSliceEqual(a, b []string) bool {
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
	cases := [][]string{
		{"hello", "world", "foo", "bar"},
		{""},
		{"a"},
		{},
		{"hello#world", "foo#bar"},
		{"5#abc", "def"},
	}
	for _, strs := range cases {
		result := decode(encode(strs))
		assert(strSliceEqual(result, strs), fmt.Sprintf("failed on: %v", strs))
	}
	fmt.Println("all tests pass")
}

func main() { runTests() }
