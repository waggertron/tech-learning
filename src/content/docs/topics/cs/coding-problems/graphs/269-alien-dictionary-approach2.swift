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
    func alienOrder(_ words: [String]) -> String {
        let characters = Set(words.flatMap(Array.init))
        var graph = Dictionary(uniqueKeysWithValues: characters.map { ($0, Set<Character>()) })
        var indegree = Dictionary(uniqueKeysWithValues: characters.map { ($0, 0) })
        for index in 0..<(words.count - 1) {
            let left = Array(words[index]), right = Array(words[index + 1])
            if left.count > right.count && left.prefix(right.count) == right[...] { return "" }
            for position in 0..<min(left.count, right.count) where left[position] != right[position] {
                if graph[left[position]]!.insert(right[position]).inserted { indegree[right[position]]! += 1 }
                break
            }
        }
        var queue = indegree.filter { $0.value == 0 }.map(\.key).sorted(), result: [Character] = []
        while !queue.isEmpty {
            let current = queue.removeFirst(); result.append(current)
            for next in graph[current]!.sorted() {
                indegree[next]! -= 1
                if indegree[next] == 0 { queue.append(next); queue.sort() }
            }
        }
        return result.count == characters.count ? String(result) : ""
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:2e7ed925801d40c6c21bcfa7f7e854ace7dbcd3d55ba691ed723efc89758e7a5
    expectEqual(Solution().alienOrder(["wrt", "wrf", "er", "ett", "rftt"]), "wertf", "canonical-order")
    expectEqual(Solution().alienOrder(["z", "x", "z"]), "", "cycle-has-no-order")
    expectEqual(Solution().alienOrder(["a"]), "a", "single-word")
    // EXCLUDED_VECTOR empty-dictionary: [[]] | The problem contract requires at least one word.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
