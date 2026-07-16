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
    func largestRectangleArea(_ heights: [Int]) -> Int {
        var best = 0
        var stack: [(start: Int, height: Int)] = []
        for index in 0...heights.count {
            let height = index == heights.count ? 0 : heights[index]
            var start = index
            while let last = stack.last, last.height > height {
                let bar = stack.removeLast()
                best = max(best, bar.height * (index - bar.start))
                start = bar.start
            }
            stack.append((start, height))
        }
        return best
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:daa22a91ebc7d0635e90785477ed4f97288b84287025614394d45de740350249
    expectEqual(Solution().largestRectangleArea([2, 1, 5, 6, 2, 3]), 10, "classic")
    expectEqual(Solution().largestRectangleArea([2, 4]), 4, "two-bars")
    expectEqual(Solution().largestRectangleArea([1, 1, 1]), 3, "flat")
    expectEqual(Solution().largestRectangleArea([5]), 5, "single-bar")
    // EXCLUDED_VECTOR empty-histogram: [[]] | The published histogram contains at least one bar.
    // EXCLUDED_VECTOR negative-height: [[2,-1,2]] | Bar heights must be nonnegative.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
