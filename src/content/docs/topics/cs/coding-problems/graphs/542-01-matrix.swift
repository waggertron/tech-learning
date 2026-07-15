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
    func updateMatrix(_ mat: [[Int]]) -> [[Int]] {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:c32d25c227da202ce47c382568a3472c53f707bd2a564e20fe462f1a3e97adc5
    expectEqual(Solution().updateMatrix([[0, 0, 0], [0, 1, 0], [0, 0, 0]]), [[0, 0, 0], [0, 1, 0], [0, 0, 0]], "center-one")
    expectEqual(Solution().updateMatrix([[0, 0, 0], [0, 1, 0], [1, 1, 1]]), [[0, 0, 0], [0, 1, 0], [1, 2, 1]], "growing-distances")
    expectEqual(Solution().updateMatrix([[0]]), [[0]], "single-zero")
    // EXCLUDED_VECTOR no-zero: [[[1]]] | The problem contract guarantees at least one zero.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
