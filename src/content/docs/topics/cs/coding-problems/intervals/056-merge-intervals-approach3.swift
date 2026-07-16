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
    func merge(_ intervals: [[Int]]) -> [[Int]] {
        let maximum = intervals.map { $0[1] }.max()!
        var starts = Array(repeating: 0, count: maximum + 2)
        var ends = Array(repeating: 0, count: maximum + 2)
        for interval in intervals { starts[interval[0]] += 1; ends[interval[1]] += 1 }
        var result: [[Int]] = []
        var open = 0
        var start = 0
        for value in 0...maximum {
            if starts[value] > 0 && open == 0 { start = value }
            open += starts[value]
            open -= ends[value]
            if ends[value] > 0 && open == 0 { result.append([start, value]) }
        }
        return result
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:2ece3be0ff7c4b299a94614f7a74f256e8ddeada34fbdf62d628b59d7560571c
    expectEqual(Solution().merge([[1, 3], [2, 6], [8, 10], [15, 18]]), [[1, 6], [8, 10], [15, 18]], "separate-and-overlapping-groups")
    expectEqual(Solution().merge([[1, 4], [4, 5]]), [[1, 5]], "touching-boundaries-merge")
    expectEqual(Solution().merge([[1, 10], [2, 3]]), [[1, 10]], "nested-interval")
    expectEqual(Solution().merge([[1, 1]]), [[1, 1]], "single-point-interval")
    // EXCLUDED_VECTOR reversed-interval: [[[3,1]]] | Every interval must have a start less than or equal to its end.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
