package main

import (
	"fmt"
	"strconv"
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

func encode(strs []string) string {
	var sb strings.Builder
	for _, s := range strs {
		sb.WriteString(strconv.Itoa(len(s)))
		sb.WriteByte('#')
		sb.WriteString(s)
	}
	return sb.String()
}

func decode(s string) []string {
	result := []string{}
	i := 0
	for i < len(s) {
		j := strings.Index(s[i:], "#")
		j += i
		length, _ := strconv.Atoi(s[i:j])
		result = append(result, s[j+1:j+1+length])
		i = j + 1 + length
	}
	return result
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
