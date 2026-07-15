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
    func possibleBipartition(_ n: Int, _ dislikes: [[Int]]) -> Bool {
        var graph = Array(repeating: [Int](), count: n + 1)
        for edge in dislikes { graph[edge[0]].append(edge[1]); graph[edge[1]].append(edge[0]) }
        var color = Array(repeating: 0, count: n + 1)
        for start in 1...n where color[start] == 0 {
            var queue = [start], head = 0; color[start] = 1
            while head < queue.count {
                let person = queue[head]; head += 1
                for next in graph[person] {
                    if color[next] == 0 { color[next] = -color[person]; queue.append(next) }
                    else if color[next] == color[person] { return false }
                }
            }
        }
        return true
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:662518a77dd932a37c22815920b65d9303e739936d04638e5be2cbb2bfb7f038
    expectEqual(Solution().possibleBipartition(4, [[1, 2], [1, 3], [2, 4]]), true, "possible-groups")
    expectEqual(Solution().possibleBipartition(3, [[1, 2], [1, 3], [2, 3]]), false, "odd-dislike-cycle")
    expectEqual(Solution().possibleBipartition(1, []), true, "one-person")
    // EXCLUDED_VECTOR person-out-of-range: [2,[[1,3]]] | Every person identifier must be in the range one through n.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
