package main

import (
	"container/heap"
	"fmt"
)

// Min-heap on negated timestamp acts as max-heap by time.
// Each entry: [negTime, userId, tweetIndex, tweetId]
type heapEntry [4]int

type FeedHeap []heapEntry

func (h FeedHeap) Len() int            { return len(h) }
func (h FeedHeap) Less(i, j int) bool  { return h[i][0] < h[j][0] } // smaller negTime = newer
func (h FeedHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *FeedHeap) Push(x any)         { *h = append(*h, x.(heapEntry)) }
func (h *FeedHeap) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[:n-1]
	return x
}

type Twitter struct {
	time    int
	tweets  map[int][][2]int // userId -> []{ timestamp, tweetId }
	follows map[int]map[int]bool
}

func Constructor() Twitter {
	return Twitter{
		tweets:  make(map[int][][2]int),
		follows: make(map[int]map[int]bool),
	}
}

func (t *Twitter) PostTweet(userId, tweetId int) {
	t.tweets[userId] = append(t.tweets[userId], [2]int{t.time, tweetId}) // L1: O(1)
	t.time++
}

func (t *Twitter) Follow(followerId, followeeId int) {
	if t.follows[followerId] == nil {
		t.follows[followerId] = make(map[int]bool)
	}
	t.follows[followerId][followeeId] = true // L2: O(1)
}

func (t *Twitter) Unfollow(followerId, followeeId int) {
	delete(t.follows[followerId], followeeId) // L3: O(1)
}

func (t *Twitter) GetNewsFeed(userId int) []int {
	users := map[int]bool{userId: true}
	for u := range t.follows[userId] {
		users[u] = true
	}

	h := &FeedHeap{}
	heap.Init(h)
	for u := range users { // L4: O(k) seed
		tw := t.tweets[u]
		if len(tw) > 0 {
			i := len(tw) - 1
			heap.Push(h, heapEntry{-tw[i][0], u, i, tw[i][1]})
		}
	}

	feed := []int{}
	for h.Len() > 0 && len(feed) < 10 { // L6: at most 10 iters
		e := heap.Pop(h).(heapEntry) // L7: O(log k) pop
		_, u, i, tid := e[0], e[1], e[2], e[3]
		feed = append(feed, tid)
		if i > 0 {
			tw := t.tweets[u]
			heap.Push(h, heapEntry{-tw[i-1][0], u, i - 1, tw[i-1][1]}) // L8: O(log k) push
		}
	}
	return feed
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

func sliceEqual(a, b []int) bool {
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
	t := Constructor()
	t.PostTweet(1, 5)
	assert(sliceEqual(t.GetNewsFeed(1), []int{5}))

	t.Follow(1, 2)
	t.PostTweet(2, 6)
	assert(sliceEqual(t.GetNewsFeed(1), []int{6, 5}))

	t.Unfollow(1, 2)
	assert(sliceEqual(t.GetNewsFeed(1), []int{5}))

	t2 := Constructor()
	for i := 0; i < 12; i++ {
		t2.PostTweet(1, i)
	}
	feed := t2.GetNewsFeed(1)
	assert(len(feed) == 10)
	expected := []int{11, 10, 9, 8, 7, 6, 5, 4, 3, 2}
	assert(sliceEqual(feed, expected))

	fmt.Println("all tests pass")
}

func main() { runTests() }
