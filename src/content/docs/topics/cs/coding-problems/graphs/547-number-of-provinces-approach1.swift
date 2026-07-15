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
    func findCircleNum(_ isConnected: [[Int]]) -> Int {
        let n = isConnected.count
        var seen = Set<Int>(), provinces = 0
        func visit(_ city: Int) {
            if !seen.insert(city).inserted { return }
            for next in 0..<n where isConnected[city][next] == 1 { visit(next) }
        }
        for city in 0..<n where !seen.contains(city) { provinces += 1; visit(city) }
        return provinces
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:b7fe08d5b5efaf0a89cab5ad8ff0fa6106e70c4d7c590ef687d3747e6ed84724
    expectEqual(Solution().findCircleNum([[1, 1, 0], [1, 1, 0], [0, 0, 1]]), 2, "two-provinces")
    expectEqual(Solution().findCircleNum([[1, 1, 1], [1, 1, 1], [1, 1, 1]]), 1, "all-connected")
    expectEqual(Solution().findCircleNum([[1]]), 1, "single-city")
    // EXCLUDED_VECTOR nonsquare-matrix: [[[1,0],[0]]] | The problem contract requires a square connectivity matrix.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
