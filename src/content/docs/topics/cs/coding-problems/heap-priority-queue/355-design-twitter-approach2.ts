function assert(condition: boolean, msg: string = ''): void {
    if (!condition) throw new Error(msg || 'Assertion failed');
}

// Min-heap on negated timestamp acts as max-heap by time.
// Each entry: [negTime, userId, tweetIndex, tweetId]
type HeapEntry = [number, number, number, number];

class MinHeap {
    private data: HeapEntry[] = [];

    get size(): number { return this.data.length; }

    push(val: HeapEntry): void {
        this.data.push(val);
        this._siftUp(this.data.length - 1);
    }

    pop(): HeapEntry {
        const top = this.data[0];
        const last = this.data.pop()!;
        if (this.data.length > 0) {
            this.data[0] = last;
            this._siftDown(0);
        }
        return top;
    }

    private _siftUp(i: number): void {
        while (i > 0) {
            const p = (i - 1) >> 1;
            if (this.data[p][0] <= this.data[i][0]) break;
            [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
            i = p;
        }
    }

    private _siftDown(i: number): void {
        const n = this.data.length;
        while (true) {
            let smallest = i;
            const l = 2 * i + 1, r = 2 * i + 2;
            if (l < n && this.data[l][0] < this.data[smallest][0]) smallest = l;
            if (r < n && this.data[r][0] < this.data[smallest][0]) smallest = r;
            if (smallest === i) break;
            [this.data[smallest], this.data[i]] = [this.data[i], this.data[smallest]];
            i = smallest;
        }
    }
}

class Twitter {
    private time = 0;
    private tweets = new Map<number, Array<[number, number]>>();  // userId -> [(time, tweetId)]
    private follows = new Map<number, Set<number>>();              // followerId -> Set<followeeId>

    private getTweets(userId: number): Array<[number, number]> {
        if (!this.tweets.has(userId)) this.tweets.set(userId, []);
        return this.tweets.get(userId)!;
    }

    private getFollows(userId: number): Set<number> {
        if (!this.follows.has(userId)) this.follows.set(userId, new Set());
        return this.follows.get(userId)!;
    }

    postTweet(userId: number, tweetId: number): void {
        this.getTweets(userId).push([this.time++, tweetId]);  // L1: O(1)
    }

    follow(followerId: number, followeeId: number): void {
        this.getFollows(followerId).add(followeeId);           // L2: O(1)
    }

    unfollow(followerId: number, followeeId: number): void {
        this.getFollows(followerId).delete(followeeId);        // L3: O(1)
    }

    getNewsFeed(userId: number): number[] {
        const users = new Set([userId, ...this.getFollows(userId)]);
        const heap = new MinHeap();

        // Seed: latest tweet from each user          L4: O(k) seed
        for (const u of users) {
            const tw = this.getTweets(u);
            if (tw.length > 0) {
                const i = tw.length - 1;
                heap.push([-tw[i][0], u, i, tw[i][1]]);
            }
        }
        // L5: heapify already done incrementally via push

        const feed: number[] = [];
        while (heap.size > 0 && feed.length < 10) {  // L6: at most 10 iters
            const [, u, i, tid] = heap.pop();         // L7: O(log k) pop
            feed.push(tid);
            if (i > 0) {
                const tw = this.getTweets(u);
                heap.push([-tw[i - 1][0], u, i - 1, tw[i - 1][1]]); // L8: O(log k) push
            }
        }
        return feed;
    }
}

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

console.log("all tests pass");
