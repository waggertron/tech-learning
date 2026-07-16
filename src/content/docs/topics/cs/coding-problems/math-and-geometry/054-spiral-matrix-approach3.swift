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
    func spiralOrder(_ matrix: [[Int]]) -> [Int] {
        guard !matrix.isEmpty else { return [] }
        return matrix[0] + spiralOrder(rotateCounterclockwise(Array(matrix.dropFirst())))
    }

    private func rotateCounterclockwise(_ matrix: [[Int]]) -> [[Int]] {
        guard !matrix.isEmpty, !matrix[0].isEmpty else { return [] }
        return stride(from: matrix[0].count - 1, through: 0, by: -1).map { column in
            matrix.map { row in row[column] }
        }
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:a38a778f60dc60ba3c6dbedb3a3d3b8385967c1f18422fe4eff82257267dea21
    expectEqual(Solution().spiralOrder([[1, 2, 3], [4, 5, 6], [7, 8, 9]]), [1, 2, 3, 6, 9, 8, 7, 4, 5], "square-matrix")
    expectEqual(Solution().spiralOrder([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]), [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7], "wide-matrix")
    expectEqual(Solution().spiralOrder([[1, 2, 3, 4]]), [1, 2, 3, 4], "single-row")
    expectEqual(Solution().spiralOrder([[1], [2], [3], [4]]), [1, 2, 3, 4], "single-column")
    expectEqual(Solution().spiralOrder([[42]]), [42], "single-cell")
    // EXCLUDED_VECTOR empty-matrix: [[]] | The matrix must contain at least one row and one column.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
