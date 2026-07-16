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
    func maxArea(_ height: [Int]) -> Int {
        guard height.count >= 2 else { return 0 }
        var left = 0
        var right = height.count - 1
        var best = 0
        while left < right {
            best = max(best, min(height[left], height[right]) * (right - left))
            if height[left] <= height[right] {
                left += 1
            } else {
                right -= 1
            }
        }
        return best
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:1adf2e9e009941baaa2703fdb4bc7f46a1397b4c104e2cecfeaee7ff925b7947
    expectEqual(Solution().maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]), 49, "classic")
    expectEqual(Solution().maxArea([4, 3, 2, 1, 4]), 16, "equal-ends")
    expectEqual(Solution().maxArea([1, 2, 4, 3]), 4, "best-inside")
    expectEqual(Solution().maxArea([1, 1]), 1, "minimum-length")
    // EXCLUDED_VECTOR too-short: [[7]] | A container requires at least two lines.
    // EXCLUDED_VECTOR negative-height: [[2,-1,2]] | Line heights must be nonnegative.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
