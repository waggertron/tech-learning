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
    func jump(_ nums: [Int]) -> Int {
        if nums.count == 1 { return 0 }
        var jumps = 0, currentEnd = 0, farthest = 0
        for index in 0..<(nums.count - 1) {
            farthest = max(farthest, index + nums[index])
            if index == currentEnd { jumps += 1; currentEnd = farthest }
        }
        return jumps
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:cd4564fb0006b10fd847627e6814fa85604cf0814a1cb8dc9acdba32e2c57479
    expectEqual(Solution().jump([2, 3, 1, 1, 4]), 2, "two-jumps")
    expectEqual(Solution().jump([2, 3, 0, 1, 4]), 2, "zero-inside-path")
    expectEqual(Solution().jump([0]), 0, "already-at-end")
    // EXCLUDED_VECTOR unreachable-end: [[0,1]] | The problem contract guarantees that the final index is reachable.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
