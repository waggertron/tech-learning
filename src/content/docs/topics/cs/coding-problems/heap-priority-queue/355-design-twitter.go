package main

import "fmt"

type Twitter struct {
	// TODO: implement
}

func Constructor() Twitter {
	return Twitter{}
}

func (t *Twitter) PostTweet(userId, tweetId int) {
	// TODO: implement
}

func (t *Twitter) Follow(followerId, followeeId int) {
	// TODO: implement
}

func (t *Twitter) Unfollow(followerId, followeeId int) {
	// TODO: implement
}

func (t *Twitter) GetNewsFeed(userId int) []int {
	// TODO: implement
	return nil
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
