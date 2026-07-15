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
    func canFinish(_ numCourses: Int, _ prerequisites: [[Int]]) -> Bool {
        var graph = Array(repeating: [Int](), count: numCourses)
        for edge in prerequisites { graph[edge[0]].append(edge[1]) }
        var color = Array(repeating: 0, count: numCourses)
        func visit(_ course: Int) -> Bool {
            if color[course] == 1 { return false }
            if color[course] == 2 { return true }
            color[course] = 1
            for next in graph[course] where !visit(next) { return false }
            color[course] = 2
            return true
        }
        return (0..<numCourses).allSatisfy(visit)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:ed8fd2c6554df64a34728495c5a678faa1d9c8dfd7659ef5258e965ff11d7621
    expectEqual(Solution().canFinish(3, [[1, 0], [2, 1]]), true, "simple-chain")
    expectEqual(Solution().canFinish(2, [[1, 0], [0, 1]]), false, "two-course-cycle")
    expectEqual(Solution().canFinish(1, []), true, "one-course")
    // EXCLUDED_VECTOR course-out-of-range: [2,[[2,0]]] | Every course identifier must be smaller than numCourses.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
