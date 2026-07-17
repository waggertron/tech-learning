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
    private func normalized(_ values: [[Int]]) -> [[Int]] {
        values.sorted { $0.lexicographicallyPrecedes($1) }
    }

    func subsetsWithDup(_ nums: [Int]) -> [[Int]] {
        let values = nums.sorted(); var result: [[Int]] = []
        func search(_ start: Int, _ current: [Int]) { result.append(current); var previous: Int?; for index in start..<values.count { if values[index] == previous { continue }; previous = values[index]; search(index + 1, current + [values[index]]) } }
        search(0, []); return normalized(result)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:1e9f82ec5edbddd464b9dd40c4e07831a2a0414d0364e761441b1d8469984474
    expectEqual(Solution().subsetsWithDup([1, 2, 2]), [[], [1], [1, 2], [1, 2, 2], [2], [2, 2]], "canonical")
    expectEqual(Solution().subsetsWithDup([0]), [[], [0]], "single")
    expectEqual(Solution().subsetsWithDup([2, 2]), [[], [2], [2, 2]], "all-duplicates")
    expectEqual(Solution().subsetsWithDup([]), [[]], "empty")
    expectEqual(Solution().subsetsWithDup([-1, -1, 2]), [[], [-1], [-1, -1], [-1, -1, 2], [-1, 2], [2]], "mixed")
    // EXCLUDED_VECTOR outside-bounds: [[11]] | Values stay within the documented bounds.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
