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
    func searchMatrix(_ matrix: [[Int]], _ target: Int) -> Bool {
        for row in matrix {
            guard target >= row[0] && target <= row[row.count - 1] else { continue }
            var low = 0
            var high = row.count - 1
            while low <= high {
                let middle = low + (high - low) / 2
                if row[middle] == target { return true }
                if row[middle] < target {
                    low = middle + 1
                } else {
                    high = middle - 1
                }
            }
            return false
        }
        return false
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:c08ca7dc6f423981c1c699504ff089c4e068316a61b4b8d402de9eb97784fd58
    expectEqual(Solution().searchMatrix([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 3), true, "target-present")
    expectEqual(Solution().searchMatrix([[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], 13), false, "target-absent")
    expectEqual(Solution().searchMatrix([[1]], 1), true, "single-cell-found")
    expectEqual(Solution().searchMatrix([[1]], 0), false, "single-cell-missing")
    expectEqual(Solution().searchMatrix([[1, 4, 9]], 9), true, "one-row-last-value")
    // EXCLUDED_VECTOR empty-matrix: [[],1] | The matrix contract requires at least one row and one column.
    // EXCLUDED_VECTOR empty-row: [[[]],1] | Every matrix row must contain at least one value.
    // EXCLUDED_VECTOR overlapping-row-ranges: [[[1,5],[3,7]],3] | Each row must start after the previous row ends.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
