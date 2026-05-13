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

func slicesEqual(a, b []int) bool {
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

func partitionLabels(s string) []int {
	// TODO: implement
	return nil
}

func runTests() {
	assert(slicesEqual(partitionLabels("ababcbacadefegdehijhklij"), []int{9, 7, 8}))
	assert(slicesEqual(partitionLabels("eccbbbbdec"), []int{10}))
	assert(slicesEqual(partitionLabels("a"), []int{1}))
	assert(slicesEqual(partitionLabels("abcd"), []int{1, 1, 1, 1}))
	assert(slicesEqual(partitionLabels("aabb"), []int{2, 2}))
	fmt.Println("all tests pass")
}

func main() { runTests() }
