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
    func intersection(_ nums1: [Int], _ nums2: [Int]) -> [Int] {
        Array(Set(nums1).intersection(Set(nums2))).sorted()
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:f2f0979535b357174d75c0715df55762c9da33f27e6d09392538bd3bc77e9d06
    expectEqual(Solution().intersection([1, 2, 2, 1], [2, 2]), [2], "duplicates")
    expectEqual(Solution().intersection([4, 9, 5], [9, 4, 9, 8, 4]), [4, 9], "two-values")
    expectEqual(Solution().intersection([1, 2, 3], [4, 5, 6]), [], "disjoint")
    expectEqual(Solution().intersection([1, 1, 1], [1, 1, 1]), [1], "same-duplicates")
    expectEqual(Solution().intersection([], [1]), [], "empty")
    // EXCLUDED_VECTOR unbounded: [[1001],[1001]] | Values follow the documented integer bounds.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
