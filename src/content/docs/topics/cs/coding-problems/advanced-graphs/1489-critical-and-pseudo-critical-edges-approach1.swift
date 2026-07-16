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
    func findCriticalAndPseudoCriticalEdges(_ n: Int, _ edges: [[Int]]) -> [[Int]] {
        let ordered = edges.enumerated().map { [$0.element[0], $0.element[1], $0.element[2], $0.offset] }.sorted { $0[2] < $1[2] }
        func mst(skipping skipped: Int?, forcing forced: Int?) -> Int {
            var parent = Array(0..<n), rank = Array(repeating: 0, count: n), total = 0, used = 0
            func find(_ value: Int) -> Int { var node = value; while parent[node] != node { node = parent[node] }; return node }
            func unite(_ left: Int, _ right: Int) -> Bool {
                var a = find(left), b = find(right); if a == b { return false }
                if rank[a] < rank[b] { swap(&a, &b) }; parent[b] = a; if rank[a] == rank[b] { rank[a] += 1 }; return true
            }
            if let forced { let edge = ordered[forced]; if unite(edge[0], edge[1]) { total += edge[2]; used += 1 } }
            for index in ordered.indices where index != skipped && index != forced {
                let edge = ordered[index]; if unite(edge[0], edge[1]) { total += edge[2]; used += 1 }
            }
            return used == n - 1 ? total : Int.max / 4
        }
        let baseline = mst(skipping: nil, forcing: nil); var critical: [Int] = [], pseudo: [Int] = []
        for index in ordered.indices {
            if mst(skipping: index, forcing: nil) > baseline { critical.append(ordered[index][3]) }
            else if mst(skipping: nil, forcing: index) == baseline { pseudo.append(ordered[index][3]) }
        }
        return [critical.sorted(), pseudo.sorted()]
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:cd6856a28c2475edd2195ad3207aa1bd88187e711510bcc77826cb041b18bf67
    expectEqual(Solution().findCriticalAndPseudoCriticalEdges(5, [[0, 1, 1], [1, 2, 1], [2, 3, 2], [0, 3, 2], [0, 4, 3], [3, 4, 3], [1, 4, 6]]), [[0, 1], [2, 3, 4, 5]], "canonical")
    expectEqual(Solution().findCriticalAndPseudoCriticalEdges(3, [[0, 1, 1], [1, 2, 1], [0, 2, 1]]), [[], [0, 1, 2]], "equal-triangle")
    expectEqual(Solution().findCriticalAndPseudoCriticalEdges(3, [[0, 1, 1], [1, 2, 2]]), [[0, 1], []], "unique-tree")
    expectEqual(Solution().findCriticalAndPseudoCriticalEdges(4, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 3, 1]]), [[], [0, 1, 2, 3]], "equal-cycle")
    expectEqual(Solution().findCriticalAndPseudoCriticalEdges(2, [[0, 1, 7]]), [[0], []], "single-edge")
    // EXCLUDED_VECTOR disconnected: [4,[[0,1,1],[2,3,1]]] | The graph is connected.
    // EXCLUDED_VECTOR malformed-edge: [2,[[0,1]]] | Each edge contains two endpoints and one weight.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
