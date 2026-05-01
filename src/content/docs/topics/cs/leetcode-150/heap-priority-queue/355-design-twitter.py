class Twitter:

    def __init__(self):
        pass  # TODO: implement

    def postTweet(self, userId, tweetId):
        pass  # TODO: implement

    def follow(self, followerId, followeeId):
        pass  # TODO: implement

    def unfollow(self, followerId, followeeId):
        pass  # TODO: implement

    def getNewsFeed(self, userId):
        pass  # TODO: implement

def _run_tests():
    t = Twitter()
    t.postTweet(1, 5)
    assert t.getNewsFeed(1) == [5]
    t.follow(1, 2)
    t.postTweet(2, 6)
    assert t.getNewsFeed(1) == [6, 5]
    t.unfollow(1, 2)
    assert t.getNewsFeed(1) == [5]
    t2 = Twitter()
    for i in range(12):
        t2.postTweet(1, i)
    feed = t2.getNewsFeed(1)
    assert len(feed) == 10
    assert feed == list(range(11, 1, -1))
    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
