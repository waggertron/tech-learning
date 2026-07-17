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
    func containsDuplicate(_ nums: [Int]) -> Bool {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:4bcf4edd544782fcd1e159373279af2d64fcef2360aabc4c0ed6bd5d6b43f7be
    expectEqual(Solution().containsDuplicate([1, 2, 3, 1]), true, "duplicate")
    expectEqual(Solution().containsDuplicate([1, 2, 3, 4]), false, "distinct")
    expectEqual(Solution().containsDuplicate([1, 1, 1, 3, 3, 4, 3, 2, 4, 2]), true, "many-duplicates")
    expectEqual(Solution().containsDuplicate([]), false, "empty")
    expectEqual(Solution().containsDuplicate([5]), false, "single")
    expectEqual(Solution().containsDuplicate([5, 5]), true, "pair")
    // EXCLUDED_VECTOR outside-value-bounds: [[1000000001]] | Values stay within the documented integer bounds.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
