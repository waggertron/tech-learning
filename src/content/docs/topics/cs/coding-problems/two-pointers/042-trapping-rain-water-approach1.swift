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
    func trap(_ height: [Int]) -> Int {
        var water = 0
        for index in height.indices {
            var leftMax = 0
            var rightMax = 0
            for left in 0...index { leftMax = max(leftMax, height[left]) }
            for right in index..<height.count { rightMax = max(rightMax, height[right]) }
            water += min(leftMax, rightMax) - height[index]
        }
        return water
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:ba07495afa59994637db862adf386b4ecca6363085c8cbfacf7bc876fde5f0aa
    expectEqual(Solution().trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]), 6, "classic")
    expectEqual(Solution().trap([4, 2, 0, 3, 2, 5]), 9, "deep-basin")
    expectEqual(Solution().trap([2, 0, 2]), 2, "single-basin")
    expectEqual(Solution().trap([7]), 0, "single-bar")
    // EXCLUDED_VECTOR empty-input: [[]] | The published input contains at least one bar.
    // EXCLUDED_VECTOR negative-height: [[1,-1,1]] | Bar heights must be nonnegative.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
