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
        // TODO: Implement
        fatalError("TODO: Implement")
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
