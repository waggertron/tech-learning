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
        var frontier = Set([0]), seen = frontier, jumps = 0
        while !frontier.isEmpty {
            jumps += 1
            var next = Set<Int>()
            for index in frontier {
                let end = min(nums.count - 1, index + nums[index])
                if index < end {
                    for destination in (index + 1)...end {
                        if destination == nums.count - 1 { return jumps }
                        if seen.insert(destination).inserted { next.insert(destination) }
                    }
                }
            }
            frontier = next
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
