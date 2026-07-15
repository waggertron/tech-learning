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
    func countComponents(_ n: Int, _ edges: [[Int]]) -> Int {
        var unionFind = UnionFind(n), components = n
        for edge in edges where unionFind.union(edge[0], edge[1]) { components -= 1 }
        return components
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:4052dea7953b371c8e6db83e3ea9c5b9e3d1a6dca9e9aba06d05ac35c4ee2896
    expectEqual(Solution().countComponents(5, [[0, 1], [1, 2], [3, 4]]), 2, "two-components")
    expectEqual(Solution().countComponents(4, [[0, 1], [1, 2], [2, 3]]), 1, "all-connected")
    expectEqual(Solution().countComponents(1, []), 1, "single-node")
    // EXCLUDED_VECTOR vertex-out-of-range: [2,[[0,2]]] | Every endpoint must be in the range zero through n minus one.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
