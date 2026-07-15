// LEETCODE_TYPE: Solution

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

final class Solution {
    func minEatingSpeed(_ piles: [Int], _ h: Int) -> Int {
        var speed = piles.max() ?? 1
        while speed >= 1 {
            let hours = piles.reduce(0) { total, pile in
                total + (pile + speed - 1) / speed
            }
            if hours > h { return speed + 1 }
            speed -= 1
        }
        return 1
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:2f697980f25c805e7d0b9ea46f52b11ce7ba88e5665717ef2df76b289633d955
    expectEqual(Solution().minEatingSpeed([3, 6, 7, 11], 8), 4, "sample-eight-hours")
    expectEqual(Solution().minEatingSpeed([30, 11, 23, 4, 20], 5), 30, "one-hour-per-pile")
    expectEqual(Solution().minEatingSpeed([30, 11, 23, 4, 20], 6), 23, "one-extra-hour")
    expectEqual(Solution().minEatingSpeed([1], 1), 1, "single-banana")
    expectEqual(Solution().minEatingSpeed([100], 99), 2, "single-large-pile")
    // EXCLUDED_VECTOR empty-piles: [[],1] | The problem contract requires at least one pile.
    // EXCLUDED_VECTOR zero-sized-pile: [[0,3],2] | Every pile must contain at least one banana.
    // EXCLUDED_VECTOR fewer-hours-than-piles: [[3,6,7],2] | The available hours must be at least the number of piles.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
