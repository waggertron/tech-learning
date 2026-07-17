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

    func permute(_ nums: [Int]) -> [[Int]] {
        var result: [[Int]] = [], used = Array(repeating: false, count: nums.count)
        func search(_ current: [Int]) { if current.count == nums.count { result.append(current); return }; for index in nums.indices where !used[index] { used[index] = true; search(current + [nums[index]]); used[index] = false } }
        search([]); return normalized(result)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:65f1e66c5a72da4327ac32f66b460368638591c43f73a06a6f531d67cd27b0e8
    expectEqual(Solution().permute([1, 2, 3]), [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]], "three")
    expectEqual(Solution().permute([0, 1]), [[0, 1], [1, 0]], "two")
    expectEqual(Solution().permute([1]), [[1]], "single")
    expectEqual(Solution().permute([-1, 2]), [[-1, 2], [2, -1]], "negative")
    expectEqual(Solution().permute([]), [[]], "empty")
    // EXCLUDED_VECTOR duplicates: [[1,1]] | All input values are unique.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
