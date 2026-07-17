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
    func numPairsDivisibleBy60(_ time: [Int]) -> Int {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:173625926ba4368b33fa2f5272a6606cf64e16c3103d01b96d8ef43bc6e7742c
    expectEqual(Solution().numPairsDivisibleBy60([30, 20, 150, 100, 40]), 3, "canonical")
    expectEqual(Solution().numPairsDivisibleBy60([60, 60, 60]), 3, "all-sixty")
    expectEqual(Solution().numPairsDivisibleBy60([10, 50, 90, 30]), 2, "complementary")
    expectEqual(Solution().numPairsDivisibleBy60([1]), 0, "single")
    expectEqual(Solution().numPairsDivisibleBy60([120, 60]), 1, "two-multiples")
    // EXCLUDED_VECTOR empty: [[]] | At least one song is provided.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
