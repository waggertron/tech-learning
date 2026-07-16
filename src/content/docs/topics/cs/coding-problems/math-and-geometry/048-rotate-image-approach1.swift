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
    func rotate(_ matrix: inout [[Int]]) {
        let size = matrix.count
        guard size > 0 else { return }
        var rotated = Array(repeating: Array(repeating: 0, count: size), count: size)
        for row in 0..<size {
            for column in 0..<size {
                rotated[column][size - 1 - row] = matrix[row][column]
            }
        }
        matrix = rotated
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:8d8254f85b67b8c3dd6280806a5af84baf704002ddf0575357cc73b9e89d43b7
    var argument1 = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    Solution().rotate(&argument1)
    expectEqual(argument1, [[7, 4, 1], [8, 5, 2], [9, 6, 3]], "three-by-three")
    var argument2 = [[5, 1, 9, 11], [2, 4, 8, 10], [13, 3, 6, 7], [15, 14, 12, 16]]
    Solution().rotate(&argument2)
    expectEqual(argument2, [[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]], "four-by-four")
    var argument3 = [[1, 2], [3, 4]]
    Solution().rotate(&argument3)
    expectEqual(argument3, [[3, 1], [4, 2]], "two-by-two")
    var argument4 = [[7]]
    Solution().rotate(&argument4)
    expectEqual(argument4, [[7]], "single-cell")
    // EXCLUDED_VECTOR empty-matrix: [[]] | The matrix dimension must be at least one.
    // EXCLUDED_VECTOR non-square-matrix: [[[1,2,3],[4,5,6]]] | The input must be a square matrix.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
