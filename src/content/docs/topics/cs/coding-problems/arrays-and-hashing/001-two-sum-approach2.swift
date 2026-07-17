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
    func twoSum(_ nums: [Int], _ target: Int) -> [Int] {
        let indexed = nums.enumerated().map { ($0.element, $0.offset) }.sorted { $0.0 < $1.0 }
        var left = 0, right = indexed.count - 1
        while left < right {
            let sum = indexed[left].0 + indexed[right].0
            if sum == target { return [indexed[left].1, indexed[right].1].sorted() }
            if sum < target { left += 1 } else { right -= 1 }
        }
        return []
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:5a8e1f7bbc5f32b7502411e8b1402e3d862faed37973b5d6bdeeb655c326fbcc
    expectEqual(Solution().twoSum([2, 7, 11, 15], 9), [0, 1], "canonical")
    expectEqual(Solution().twoSum([3, 2, 4], 6), [1, 2], "middle-pair")
    expectEqual(Solution().twoSum([3, 3], 6), [0, 1], "duplicate-values")
    expectEqual(Solution().twoSum([-3, 4, 3, 90], 0), [0, 2], "negative-values")
    expectEqual(Solution().twoSum([0, 4], 4), [0, 1], "two-elements")
    // EXCLUDED_VECTOR no-solution: [[1,2],8] | Exactly one valid answer exists.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
