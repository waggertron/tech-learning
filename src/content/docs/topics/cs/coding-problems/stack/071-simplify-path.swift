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
    func simplifyPath(_ path: String) -> String {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:d4c50882eadf3ad2d9ca179dbb13b975d34dbc75446402c8ed7940b2e1a84b16
    expectEqual(Solution().simplifyPath("/home/"), "/home", "trailing-slash")
    expectEqual(Solution().simplifyPath("/../"), "/", "above-root")
    expectEqual(Solution().simplifyPath("/home//foo/"), "/home/foo", "repeated-slash")
    expectEqual(Solution().simplifyPath("/a/./b/../../c/"), "/c", "dot-and-parent")
    expectEqual(Solution().simplifyPath("/"), "/", "root")
    // EXCLUDED_VECTOR relative-path: ["home/user"] | The published input is an absolute path.
    // EXCLUDED_VECTOR empty-path: [""] | The path must begin with a slash.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
