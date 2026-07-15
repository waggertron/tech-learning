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
struct UnionFind {
    var parent: [Int]
    var rank: [Int]
    init(_ count: Int) { parent = Array(0..<count); rank = Array(repeating: 0, count: count) }
    mutating func find(_ value: Int) -> Int {
        if parent[value] != value { parent[value] = find(parent[value]) }
        return parent[value]
    }
    mutating func union(_ left: Int, _ right: Int) -> Bool {
        var a = find(left), b = find(right)
        if a == b { return false }
        if rank[a] < rank[b] { swap(&a, &b) }
        parent[b] = a
        if rank[a] == rank[b] { rank[a] += 1 }
        return true
    }
}

final class Solution {
    func findCircleNum(_ isConnected: [[Int]]) -> Int {
        let n = isConnected.count
        var unionFind = UnionFind(n), provinces = n
        for row in 0..<n { for col in (row + 1)..<n where isConnected[row][col] == 1 && unionFind.union(row, col) { provinces -= 1 } }
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
