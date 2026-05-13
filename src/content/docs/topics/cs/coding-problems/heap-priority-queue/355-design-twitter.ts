function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

class Twitter {
    // TODO: implement

    postTweet(userId: number, tweetId: number): void {
        // TODO: implement
    }

    follow(followerId: number, followeeId: number): void {
        // TODO: implement
    }

    unfollow(followerId: number, followeeId: number): void {
        // TODO: implement
    }

    getNewsFeed(userId: number): number[] {
        // TODO: implement
        return [];
    }
}

function _runTests(): void {
    const t = new Twitter();
    t.postTweet(1, 5);
    assert(JSON.stringify(t.getNewsFeed(1)) === JSON.stringify([5]));

    t.follow(1, 2);
    t.postTweet(2, 6);
    assert(JSON.stringify(t.getNewsFeed(1)) === JSON.stringify([6, 5]));

    t.unfollow(1, 2);
    assert(JSON.stringify(t.getNewsFeed(1)) === JSON.stringify([5]));

    const t2 = new Twitter();
    for (let i = 0; i < 12; i++) t2.postTweet(1, i);
    const feed = t2.getNewsFeed(1);
    assert(feed.length === 10);
    assert(JSON.stringify(feed) === JSON.stringify([11, 10, 9, 8, 7, 6, 5, 4, 3, 2]));

    // perf
    const t0 = performance.now();
    const tp = new Twitter();
    for (let i = 0; i < 1000; i++) {
        tp.postTweet(i % 10, i);
        tp.follow(0, i % 10);
        tp.getNewsFeed(0);
    }
    console.log(`perf Twitter 1000 mixed ops: ${(performance.now() - t0).toFixed(1)}ms`);
    console.log('all tests pass');
}

_runTests();
