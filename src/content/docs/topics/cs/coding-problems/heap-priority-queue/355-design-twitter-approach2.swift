// LEETCODE_TYPE: Twitter
func expectEqual<T: Equatable>(
    _ actual: T,
    _ expected: T,
    _ message: String = "",
    file: StaticString = #fileID,
    line: UInt = #line
) {
    guard actual == expected else {
        let detail = message.isEmpty ? "values differ" : message
        fatalError("\(file):\(line): \(detail). Expected \(expected), got \(actual)")
    }
}

func expectTrue(
    _ condition: @autoclosure () -> Bool,
    _ message: String = "expected true",
    file: StaticString = #fileID,
    line: UInt = #line
) {
    guard condition() else {
        fatalError("\(file):\(line): \(message)")
    }
}

func reportSuccess() {
    print("All Swift tests passed")
}
// SWIFT_CATALOG_HELPER: BinaryHeap
struct BinaryHeap<Element> {
    private var elements: [Element] = []
    private let hasHigherPriority: (Element, Element) -> Bool

    init(hasHigherPriority: @escaping (Element, Element) -> Bool) {
        self.hasHigherPriority = hasHigherPriority
    }

    var count: Int { elements.count }
    var isEmpty: Bool { elements.isEmpty }
    var peek: Element? { elements.first }

    mutating func insert(_ element: Element) {
        elements.append(element)
        siftUp(from: elements.count - 1)
    }

    mutating func removeRoot() -> Element? {
        guard !elements.isEmpty else { return nil }
        if elements.count == 1 { return elements.removeLast() }

        elements.swapAt(0, elements.count - 1)
        let root = elements.removeLast()
        siftDown(from: 0)
        return root
    }

    private mutating func siftUp(from start: Int) {
        var child = start
        while child > 0 {
            let parent = (child - 1) / 2
            guard hasHigherPriority(elements[child], elements[parent]) else { return }
            elements.swapAt(child, parent)
            child = parent
        }
    }

    private mutating func siftDown(from start: Int) {
        var parent = start
        while true {
            let left = parent * 2 + 1
            guard left < elements.count else { return }
            let right = left + 1
            var candidate = left
            if right < elements.count && hasHigherPriority(elements[right], elements[left]) {
                candidate = right
            }
            guard hasHigherPriority(elements[candidate], elements[parent]) else { return }
            elements.swapAt(parent, candidate)
            parent = candidate
        }
    }
}

private struct TweetRecord { let time: Int; let id: Int }
private struct FeedCursor { let user: Int; let index: Int; let tweet: TweetRecord }
final class Twitter {
    private var clock = 0
    private var tweets: [Int: [TweetRecord]] = [:]
    private var following: [Int: Set<Int>] = [:]
    init() {}
    func postTweet(_ userId: Int, _ tweetId: Int) { clock += 1; tweets[userId, default: []].append(TweetRecord(time: clock, id: tweetId)) }
    func getNewsFeed(_ userId: Int) -> [Int] {
        var users = following[userId, default: []]; users.insert(userId)
        var heap = BinaryHeap<FeedCursor> { $0.tweet.time > $1.tweet.time }
        for user in users { if let list = tweets[user], let tweet = list.last { heap.insert(FeedCursor(user: user, index: list.count - 1, tweet: tweet)) } }
        var feed: [Int] = []
        while feed.count < 10, let cursor = heap.removeRoot() { feed.append(cursor.tweet.id); let next = cursor.index - 1; if next >= 0, let tweet = tweets[cursor.user]?[next] { heap.insert(FeedCursor(user: cursor.user, index: next, tweet: tweet)) } }
        return feed
    }
    func follow(_ followerId: Int, _ followeeId: Int) { following[followerId, default: []].insert(followeeId) }
    func unfollow(_ followerId: Int, _ followeeId: Int) { following[followerId]?.remove(followeeId) }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:ce4030ca3a3db585034dab7af5901533167dde2b79d875dec4abe81b2b27dc01
    let subject1 = Twitter()
    subject1.postTweet(1, 5)
    expectEqual(subject1.getNewsFeed(1), [5], "follow-and-unfollow[2]")
    subject1.follow(1, 2)
    subject1.postTweet(2, 6)
    expectEqual(subject1.getNewsFeed(1), [6, 5], "follow-and-unfollow[5]")
    subject1.unfollow(1, 2)
    expectEqual(subject1.getNewsFeed(1), [5], "follow-and-unfollow[7]")
    let subject2 = Twitter()
    subject2.follow(1, 2)
    subject2.postTweet(2, 20)
    subject2.postTweet(1, 10)
    subject2.postTweet(2, 21)
    expectEqual(subject2.getNewsFeed(1), [21, 10, 20], "newest-first-across-users[5]")
    let subject3 = Twitter()
    expectEqual(subject3.getNewsFeed(1), [], "empty-feed[1]")
    // EXCLUDED_VECTOR nonpositive-user-id: [[{"operation":"init","arguments":[]},{"operation":"getNewsFeed","arguments":[0]}]] | The problem contract uses positive user identifiers.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
