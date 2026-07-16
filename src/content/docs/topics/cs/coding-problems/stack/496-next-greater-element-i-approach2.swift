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
    func nextGreaterElement(_ nums1: [Int], _ nums2: [Int]) -> [Int] {
        var stack: [Int] = []
        var greater: [Int: Int] = [:]
        for value in nums2 {
            while let last = stack.last, value > last { greater[stack.removeLast()] = value }
            stack.append(value)
        }
        return nums1.map { greater[$0] ?? -1 }
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:6f01cde95f89db63d12df6cffa5de7abdd664825d8e3154f1320b2c4a78504cb
    expectEqual(Solution().nextGreaterElement([4, 1, 2], [1, 3, 4, 2]), [-1, 3, -1], "mixed-results")
    expectEqual(Solution().nextGreaterElement([2, 4], [1, 2, 3, 4]), [3, -1], "increasing-superset")
    expectEqual(Solution().nextGreaterElement([1], [1]), [-1], "single-value")
    // EXCLUDED_VECTOR not-a-subset: [[5],[1,2,3]] | Every nums1 value must appear in nums2.
    // EXCLUDED_VECTOR duplicate-values: [[1],[1,1]] | The published arrays contain distinct values.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
