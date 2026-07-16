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
    func setZeroes(_ matrix: inout [[Int]]) {
        guard !matrix.isEmpty, !matrix[0].isEmpty else { return }
        var zeroRows = Array(repeating: false, count: matrix.count)
        var zeroColumns = Array(repeating: false, count: matrix[0].count)
        for row in matrix.indices {
            for column in matrix[row].indices where matrix[row][column] == 0 {
                zeroRows[row] = true
                zeroColumns[column] = true
            }
        }
        for row in matrix.indices {
            for column in matrix[row].indices where zeroRows[row] || zeroColumns[column] {
                matrix[row][column] = 0
            }
        }
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:7306ce6cbec173ac64a05e8cc4d62821f682d3cb395037cf28ef54a6cb1b1487
    var argument1 = [[1, 1, 1], [1, 0, 1], [1, 1, 1]]
    Solution().setZeroes(&argument1)
    expectEqual(argument1, [[1, 0, 1], [0, 0, 0], [1, 0, 1]], "center-zero")
    var argument2 = [[0, 1, 2, 0], [3, 4, 5, 2], [1, 3, 1, 5]]
    Solution().setZeroes(&argument2)
    expectEqual(argument2, [[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]], "multiple-zeroes")
    var argument3 = [[1, 2], [3, 4]]
    Solution().setZeroes(&argument3)
    expectEqual(argument3, [[1, 2], [3, 4]], "no-zeroes")
    var argument4 = [[0]]
    Solution().setZeroes(&argument4)
    expectEqual(argument4, [[0]], "single-zero")
    var argument5 = [[7]]
    Solution().setZeroes(&argument5)
    expectEqual(argument5, [[7]], "single-nonzero")
    // EXCLUDED_VECTOR ragged-matrix: [[[1,2],[3]]] | Every matrix row must have the same number of columns.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
