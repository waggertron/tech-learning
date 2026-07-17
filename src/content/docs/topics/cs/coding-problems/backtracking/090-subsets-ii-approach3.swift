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
        var counts: [Int: Int] = [:]; for value in nums { counts[value, default: 0] += 1 }; let entries = counts.sorted { $0.key < $1.key }; var result: [[Int]] = []
        func search(_ index: Int, _ current: [Int]) { if index == entries.count { result.append(current); return }; let (value, count) = entries[index]; for amount in 0...count { search(index + 1, current + Array(repeating: value, count: amount)) } }
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
