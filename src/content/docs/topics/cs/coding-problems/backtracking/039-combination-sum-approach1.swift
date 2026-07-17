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

    func combinationSum(_ candidates: [Int], _ target: Int) -> [[Int]] {
        var unique = Set<[Int]>()
        func search(_ remaining: Int, _ current: [Int]) { if remaining == 0 { unique.insert(current.sorted()); return }; if remaining < 0 { return }; for value in candidates { search(remaining - value, current + [value]) } }
        search(target, []); return normalized(Array(unique))
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:b930946d881468ede6b88d809c32a58b410fd6644cdc0f4908dedfa836c7006c
    expectEqual(Solution().combinationSum([2, 3, 6, 7], 7), [[2, 2, 3], [7]], "canonical")
    expectEqual(Solution().combinationSum([2, 3, 5], 8), [[2, 2, 2, 2], [2, 3, 3], [3, 5]], "two-solutions")
    expectEqual(Solution().combinationSum([2], 1), [], "none")
    expectEqual(Solution().combinationSum([1], 2), [[1, 1]], "single-repeat")
    expectEqual(Solution().combinationSum([5, 6], 5), [[5]], "exact")
    // EXCLUDED_VECTOR nonpositive: [[0,1],1] | Candidates are distinct positive integers.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
