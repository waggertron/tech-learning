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
        let characters = Array(Set(words.flatMap(Array.init))).sorted()
        func isSorted(_ order: [Character]) -> Bool {
            let rank = Dictionary(uniqueKeysWithValues: order.enumerated().map { ($0.element, $0.offset) })
            for index in 0..<(words.count - 1) {
                let left = Array(words[index]), right = Array(words[index + 1])
                var decided = false
                for position in 0..<min(left.count, right.count) where left[position] != right[position] {
                    if rank[left[position]]! > rank[right[position]]! { return false }
                    decided = true; break
                }
                if !decided && left.count > right.count { return false }
            }
            return true
        }
        var answer: [Character]?
        func permute(_ remaining: [Character], _ current: [Character]) {
            if answer != nil { return }
            if remaining.isEmpty { if isSorted(current) { answer = current }; return }
            for index in remaining.indices {
                var next = remaining; let character = next.remove(at: index)
                permute(next, current + [character])
            }
        }
        permute(characters, [])
        return answer.map { String($0) } ?? ""
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
