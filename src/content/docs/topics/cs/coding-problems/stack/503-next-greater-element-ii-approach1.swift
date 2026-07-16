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
    func nextGreaterElements(_ nums: [Int]) -> [Int] {
        guard !nums.isEmpty else { return [] }
        return nums.indices.map { index in
            for offset in 1..<nums.count {
                let candidate = nums[(index + offset) % nums.count]
                if candidate > nums[index] { return candidate }
            }
            return -1
        }
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:ae868fb9fc46cb8de319d9ecf7169f15169d6545372e24e9e9aed557422143f5
    expectEqual(Solution().nextGreaterElements([1, 2, 1]), [2, -1, 2], "wraparound")
    expectEqual(Solution().nextGreaterElements([1, 2, 3, 4, 3]), [2, 3, 4, -1, 4], "mixed-circular")
    expectEqual(Solution().nextGreaterElements([5, 4, 3, 2, 1]), [-1, 5, 5, 5, 5], "descending")
    expectEqual(Solution().nextGreaterElements([1]), [-1], "single-value")
    // EXCLUDED_VECTOR empty-array: [[]] | The published array contains at least one value.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
