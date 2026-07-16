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
    func sumSubarrayMins(_ arr: [Int]) -> Int {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:03950a9aa5996c83ab370afed6322f8f603a1db6805a318a868497e402327d56
    expectEqual(Solution().sumSubarrayMins([3, 1, 2, 4]), 17, "classic")
    expectEqual(Solution().sumSubarrayMins([11, 81, 94, 43, 3]), 444, "mixed-large")
    expectEqual(Solution().sumSubarrayMins([2, 2]), 6, "duplicates")
    expectEqual(Solution().sumSubarrayMins([5]), 5, "single-value")
    // EXCLUDED_VECTOR empty-array: [[]] | The published input contains at least one value.
    // EXCLUDED_VECTOR zero-value: [[0]] | Published array values are positive.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
