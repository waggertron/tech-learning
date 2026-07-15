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
    func findOrder(_ numCourses: Int, _ prerequisites: [[Int]]) -> [Int] {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:dc1c058967fd3e5c3a15e30378757b2024dac1fedb307e92bdd3cd5403936a48
    expectEqual(Solution().findOrder(4, [[1, 0], [2, 1], [3, 2]]), [0, 1, 2, 3], "unique-chain")
    expectEqual(Solution().findOrder(2, [[1, 0], [0, 1]]), [], "cycle-has-no-order")
    expectEqual(Solution().findOrder(1, []), [0], "one-course")
    // EXCLUDED_VECTOR course-out-of-range: [2,[[2,0]]] | Every course identifier must be smaller than numCourses.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
