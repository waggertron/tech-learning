package main

import "fmt"

func ladderLength(beginWord string, endWord string, wordList []string) int {
	wordSet := map[string]bool{}
	for _, w := range wordList {
		wordSet[w] = true
	}
	if !wordSet[endWord] {
		return 0
	}

	L := len(beginWord)
	patterns := map[string][]string{}
	for w := range wordSet {
		for i := 0; i < L; i++ {
			key := w[:i] + "*" + w[i+1:]
			patterns[key] = append(patterns[key], w)
		}
	}

	type entry struct {
		word string
		dist int
	}
	queue := []entry{{beginWord, 1}}
	visited := map[string]bool{beginWord: true}

	for len(queue) > 0 {
		cur := queue[0]
		queue = queue[1:]
		if cur.word == endWord {
			return cur.dist
		}
		for i := 0; i < L; i++ {
			key := cur.word[:i] + "*" + cur.word[i+1:]
			for _, nb := range patterns[key] {
				if !visited[nb] {
					visited[nb] = true
					queue = append(queue, entry{nb, cur.dist + 1})
				}
			}
			patterns[key] = nil
		}
	}
	return 0
}

func assert(condition bool, msgs ...string) {
	if !condition {
		msg := "assertion failed"
		if len(msgs) > 0 {
			msg = msgs[0]
		}
		panic(msg)
	}
}

func runTests() {
	assert(ladderLength("hit", "cog", []string{"hot", "dot", "dog", "lot", "log", "cog"}) == 5)
	assert(ladderLength("hit", "cot", []string{"hot", "dot", "dog", "lot", "log", "cog"}) == 0)
	assert(ladderLength("hot", "dot", []string{"dot", "lot"}) == 2)
	assert(ladderLength("hit", "cog", []string{"hot", "dot", "dog", "lot", "log"}) == 0)
	assert(ladderLength("a", "c", []string{"a", "b", "c"}) == 2)
	fmt.Println("all tests pass")
}

func main() { runTests() }
