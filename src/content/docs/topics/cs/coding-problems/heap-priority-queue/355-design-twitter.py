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

    # --- large-input timing ---
    import time as _t
    _t0 = _t.perf_counter()
    t_big = Twitter()
    for i in range(1000):
        t_big.postTweet(i % 10, i)
        t_big.follow(0, i % 10)
        t_big.getNewsFeed(0)
    _ms = (_t.perf_counter() - _t0) * 1000
    print(f'perf Twitter 1000 mixed ops: {_ms:.1f}ms')

    print('all tests pass')

if __name__ == '__main__':
    _run_tests()
