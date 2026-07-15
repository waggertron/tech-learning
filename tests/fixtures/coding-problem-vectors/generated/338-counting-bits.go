package main

import "fmt"

func assert(condition bool, message string) {
	if !condition {
		panic(message)
	}
}

func countBits(n int) []int {
	counts := make([]int, n+1)
	for value := 1; value <= n; value++ {
		counts[value] = counts[value>>1] + (value & 1)
	}
	return counts
}

func runTests() {
	// TEST_VECTORS_BEGIN sha256:c6ee896d6c38441fea68d4a24bb494a2ee8d855229cff1259c3e14c3c9159da0
	assert(func(actual, expected []int) bool { if len(actual) != len(expected) { return false }; for i := range actual { if actual[i] != expected[i] { return false } }; return true }(countBits(2), []int{0, 1, 1}), "through-two")
	assert(func(actual, expected []int) bool { if len(actual) != len(expected) { return false }; for i := range actual { if actual[i] != expected[i] { return false } }; return true }(countBits(5), []int{0, 1, 1, 2, 1, 2}), "through-five")
	assert(func(actual, expected []int) bool { if len(actual) != len(expected) { return false }; for i := range actual { if actual[i] != expected[i] { return false } }; return true }(countBits(8), []int{0, 1, 1, 2, 1, 2, 2, 3, 1}), "through-eight")
	assert(func(actual, expected []int) bool { if len(actual) != len(expected) { return false }; for i := range actual { if actual[i] != expected[i] { return false } }; return true }(countBits(0), []int{0}), "zero")
	assert(func(actual, expected []int) bool { if len(actual) != len(expected) { return false }; for i := range actual { if actual[i] != expected[i] { return false } }; return true }(countBits(1), []int{0, 1}), "one")
	// EXCLUDED_VECTOR negative-input: [-1] | The input contract requires n to be nonnegative.
	// EXCLUDED_VECTOR above-constraint: [100001] | The published problem constraint limits n to 100000.
	// TEST_VECTORS_END
	fmt.Println("All shared test vectors passed")
}

func main() { runTests() }
