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
    func findMin(_ nums: [Int]) -> Int {
        for index in 1..<nums.count where nums[index] < nums[index - 1] {
            return nums[index]
        }
        return nums[0]
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:e876c0687dc8e307427400341cf1282347b6295c97701410de326f6f6edcb307
    expectEqual(Solution().findMin([3, 4, 5, 1, 2]), 1, "pivot-near-middle")
    expectEqual(Solution().findMin([4, 5, 6, 7, 0, 1, 2]), 0, "pivot-after-middle")
    expectEqual(Solution().findMin([11]), 11, "single-element")
    expectEqual(Solution().findMin([1, 2, 3]), 1, "not-rotated")
    expectEqual(Solution().findMin([2, 1]), 1, "two-elements-rotated")
    // EXCLUDED_VECTOR empty-array: [[]] | The problem contract requires at least one array element.
    // EXCLUDED_VECTOR duplicate-values: [[2,2,1]] | The problem contract requires distinct values.
    // EXCLUDED_VECTOR multiple-order-breaks: [[3,1,4,2]] | The array must be one rotation of a strictly increasing sequence.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
