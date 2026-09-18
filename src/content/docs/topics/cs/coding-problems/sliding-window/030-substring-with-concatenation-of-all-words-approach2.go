package main

import (
	"fmt"
	"sort"
)

func findSubstring(s string, words []string) []int {
	wordLength := len(words[0])
	required := map[string]int{}
	for _, word := range words {
		required[word]++
	}
	answer := []int{}

	for offset := 0; offset < wordLength; offset++ {
		left, used := offset, 0
		window := map[string]int{}
		for right := offset; right+wordLength <= len(s); right += wordLength {
			word := s[right : right+wordLength]
			if required[word] == 0 {
				window = map[string]int{}
				used = 0
				left = right + wordLength
				continue
			}

			window[word]++
			used++
			for window[word] > required[word] {
				outgoing := s[left : left+wordLength]
				window[outgoing]--
				used--
				left += wordLength
			}
			if used == len(words) {
				answer = append(answer, left)
				outgoing := s[left : left+wordLength]
				window[outgoing]--
				used--
				left += wordLength
			}
		}
	}
	sort.Ints(answer)
	return answer
}

func assert(condition bool, msgs ...string) {
	if !condition {
		message := "assertion failed"
		if len(msgs) > 0 {
			message = msgs[0]
		}
		panic(message)
	}
}

func runTests() {
	// TEST_VECTORS_BEGIN sha256:4ed0b0ef6a0b4d4fb8b885ec9e435566d59c98b9fe89fa186c9196f08aa9ef0d
	assert(func(actual, expected []int) bool { if len(actual) != len(expected) { return false }; for i := range actual { if actual[i] != expected[i] { return false } }; return true }(findSubstring("barfoothefoobarman", []string{"foo", "bar"}), []int{0, 9}), "canonical-two-words")
	assert(func(actual, expected []int) bool { if len(actual) != len(expected) { return false }; for i := range actual { if actual[i] != expected[i] { return false } }; return true }(findSubstring("wordgoodgoodgoodbestword", []string{"word", "good", "best", "word"}), []int{}), "missing-required-duplicate")
	assert(func(actual, expected []int) bool { if len(actual) != len(expected) { return false }; for i := range actual { if actual[i] != expected[i] { return false } }; return true }(findSubstring("barfoofoobarthefoobarman", []string{"bar", "foo", "the"}), []int{6, 9, 12}), "three-overlapping-matches")
	assert(func(actual, expected []int) bool { if len(actual) != len(expected) { return false }; for i := range actual { if actual[i] != expected[i] { return false } }; return true }(findSubstring("wordgoodgoodgoodbestword", []string{"word", "good", "best", "good"}), []int{8}), "duplicate-word-required")
	assert(func(actual, expected []int) bool { if len(actual) != len(expected) { return false }; for i := range actual { if actual[i] != expected[i] { return false } }; return true }(findSubstring("aaaaaa", []string{"aa", "aa"}), []int{0, 1, 2}), "overlapping-identical-words")
	assert(func(actual, expected []int) bool { if len(actual) != len(expected) { return false }; for i := range actual { if actual[i] != expected[i] { return false } }; return true }(findSubstring("foobar", []string{"foo", "bar"}), []int{0}), "exact-whole-string")
	assert(func(actual, expected []int) bool { if len(actual) != len(expected) { return false }; for i := range actual { if actual[i] != expected[i] { return false } }; return true }(findSubstring("foo", []string{"foo", "bar"}), []int{}), "text-shorter-than-concatenation")
	// EXCLUDED_VECTOR empty-word-list: ["foo",[]] | The word list must contain at least one word.
	// EXCLUDED_VECTOR unequal-word-lengths: ["foobar",["foo","ba"]] | Every word must have the same length.
	// TEST_VECTORS_END
	fmt.Println("all tests pass")
}

func main() {
	runTests()
}
